import {
  BatchGetCommand,
  BatchWriteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  PersonListRaw,
  PersonRepository,
  PersonViewRaw,
  RelationRaw,
} from "../../domain/ports/PersonRepository";
import { Persona } from "../../domain/model/Persona";
import { dynamo_client } from "@/modules/aws/infra/AwsClient";
import { ICountPersons } from "../../domain/ports/ICountPersons";
import { AppError } from "@/src/utils/ApiErrorHandler";
import { GetUserNameRepository } from "@/modules/relacion/domain/ports/GetUserNameRepository";

const TABLE_RELATIONS = "SocialGraph";

const MAX_RETRIES = 8;
const BASE_DELAY_MS = 80; // backoff base
const MAX_CONCURRENCY = 3; // sube a 5 si tu tabla está en on-demand y no throttlea

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
function chunk(arr: any, size: any) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function batchWriteAll(tableName: any, items: any) {
  const batches = chunk(items, 25).map((batch) => ({
    RequestItems: {
      [tableName]: batch.map((Item: any) => ({ PutRequest: { Item } })),
    },
  }));

  let idx = 0;

  // worker pool simple
  async function worker() {
    while (idx < batches.length) {
      const my = idx++;
      await sendWithRetry(batches[my]);
      if ((my + 1) % 20 === 0) {
        console.log(`[${tableName}] batches ok: ${my + 1}/${batches.length}`);
      }
    }
  }

  const workers = Array.from({ length: MAX_CONCURRENCY }, () => worker());
  await Promise.all(workers);
  console.log(`[${tableName}] DONE. total items: ${items.length}`);
}
async function sendWithRetry(params: any, attempt = 0) {
  const res = await dynamo_client.send(new BatchWriteCommand(params));
  const unprocessed =
    res.UnprocessedItems && Object.keys(res.UnprocessedItems).length
      ? res.UnprocessedItems
      : null;

  if (!unprocessed) return;

  if (attempt >= MAX_RETRIES) {
    throw new Error(
      `Too many retries. Still unprocessed: ${JSON.stringify(unprocessed).slice(0, 500)}...`,
    );
  }
  // backoff exponencial con jitter
  const delay =
    Math.min(2000, BASE_DELAY_MS * 2 ** attempt) +
    Math.floor(Math.random() * 50);

  await sleep(delay);
  return sendWithRetry({ RequestItems: unprocessed }, attempt + 1);
}

function makeRelations(userCount = 950, relCount = 50000) {
  const types = ["AMIGO", "FAMILIA", "TRABAJO", "CONOCIDO"];
  const relations: any[] = [];
  const seen = new Set<string>();

  while (relations.length < relCount * 2) {
    // *2 por bidireccional
    const a = 1 + Math.floor(Math.random() * userCount);
    let b = 1 + Math.floor(Math.random() * userCount);
    while (b === a) b = 1 + Math.floor(Math.random() * userCount);

    const t = types[Math.floor(Math.random() * types.length)];

    // firma única (una sola para el par, así no repites)
    const key = a < b ? `${a}|${b}|${t}` : `${b}|${a}|${t}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const importance = 1 + Math.floor(Math.random() * 10);

    relations.push({
      pk: `PERSON#u${a}`,
      sk: `REL#${t}#PERSON#u${b}`,
      entityType: "REL",
      typeGroup: t,
      importance,
      partner: `User ${b}`,
    });

    relations.push({
      pk: `PERSON#u${b}`,
      sk: `REL#${t}#PERSON#u${a}`,
      entityType: "REL",
      typeGroup: t,
      importance,
      partner: `User ${a}`,
    });
  }
  return relations;
}
export class DyUser
  implements PersonRepository, ICountPersons, GetUserNameRepository
{
  async createUser(input: Persona): Promise<void> {
    const now = Date.now();
    const item = {
      pk: `PERSON#u${input.id}`,
      sk: `PROFILE`,
      email: input.email,
      entityType: `PERSON`,
      name: input.name,
      nickname: input.nickname,
      residence: input.residence,
      GSI1PK: "PROFILE",
      GSI1SK: now,
    };

    await dynamo_client.send(
      new PutCommand({
        TableName: "SocialGraph",
        Item: item,
        ConditionExpression:
          "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      }),
    );
  }
  async count(): Promise<number> {
    const res = await dynamo_client.send(
      new QueryCommand({
        TableName: "SocialGraph",
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :p",
        ExpressionAttributeValues: {
          ":p": "PROFILE",
        },
        Select: "COUNT",
      }),
    );
    if (!res.Count) throw AppError.internal("No se pudo contar las personas");
    return res.Count;
  }
  async list(): Promise<PersonListRaw[]> {
    const res = await dynamo_client.send(
      new QueryCommand({
        TableName: "SocialGraph",
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :p",
        ExpressionAttributeValues: {
          ":p": "PROFILE",
        },
      }),
    );
    if (!res.Items) return [];
    return res.Items.map((i) => ({
      name: i.name,
      nickname: i.nickname,
      PK: i.pk,
      residence: i.residence,
    }));
  }
  async view(
    id: number,
  ): Promise<{ person: PersonViewRaw; relations: RelationRaw[] } | null> {
    const pk = `PERSON#u${id}`;
    const res = await dynamo_client.send(
      new QueryCommand({
        TableName: "SocialGraph",
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": pk },
      }),
    );

    if (!res.Items) return null;
    const profile = res.Items.find((i) => i.sk === "PROFILE");
    if (!profile) return null;
    const relations = res.Items.filter((i) => i.sk !== "PROFILE");

    return {
      person: {
        name: profile.name,
        nickname: profile.nickname,
        residence: profile.residence,
      },
      relations: relations.map((r) => ({
        importance: r.importance,
        otherId: "Sin definir",
        partnerName: r.partner,
        typeGroup: r.typeGroup,
      })),
    };
  }
  async getNameById(id: string): Promise<string> {
    const pk = id.startsWith("PERSON#")
      ? id
      : id.startsWith("u")
        ? `PERSON#${id}`
        : `PERSON#u${id}`;

    const res = await dynamo_client.send(
      new GetCommand({
        TableName: "SocialGraph",
        Key: { pk, sk: "PROFILE" },
      }),
    );

    if (!res.Item) {
      throw AppError.notFound(`User with id ${id} not found`);
    }

    return res.Item.name as string;
  }
  async intyect(): Promise<void> {
    const relations = makeRelations();

    console.log(`Relations: ${relations.length}`);

    await batchWriteAll(TABLE_RELATIONS, relations);

    console.log("All seeded ✅");
  }

  async mostRelationalPerson(): Promise<{
    person: PersonViewRaw;
    relations: RelationRaw[];
  }> {
    const profilesRes = await dynamo_client.send(
      new QueryCommand({
        TableName: "SocialGraph",
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :p",
        ExpressionAttributeValues: { ":p": "PROFILE" },
        ProjectionExpression: "pk, #n, nickname, residence",
        ExpressionAttributeNames: { "#n": "name" },
      }),
    );

    const profiles = profilesRes.Items ?? [];
    if (profiles.length === 0) throw AppError.notFound("No users found");

    // simple concurrency limiter
    const limit = 8;
    let i = 0;

    const counts: Array<{ item: any; count: number }> = [];
    async function worker() {
      while (i < profiles.length) {
        const idx = i++;
        const item = profiles[idx];

        const relCountRes = await dynamo_client.send(
          new QueryCommand({
            TableName: "SocialGraph",
            KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
            ExpressionAttributeValues: { ":pk": item.pk, ":sk": "REL#" },
            Select: "COUNT",
          }),
        );

        counts[idx] = { item, count: relCountRes.Count ?? 0 };
      }
    }

    await Promise.all(
      Array.from({ length: Math.min(limit, profiles.length) }, worker),
    );

    // pick max
    let best = counts[0];
    for (const c of counts) if (c.count > best.count) best = c;

    // fetch relations of best user
    const relationsRes = await dynamo_client.send(
      new QueryCommand({
        TableName: "SocialGraph",
        KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
        ExpressionAttributeValues: { ":pk": best.item.pk, ":sk": "REL#" },
        ProjectionExpression: "importance, partner, typeGroup",
      }),
    );

    const relations: RelationRaw[] = (relationsRes.Items ?? []).map(
      (r: any) => ({
        importance: r.importance,
        otherId: "Sin definir",
        partnerName: r.partner,
        typeGroup: r.typeGroup,
      }),
    );

    return {
      person: {
        name: best.item.name,
        nickname: best.item.nickname,
        residence: best.item.residence,
      },
      relations,
    };
  }

  
  async commonFriends(
    id1: string,
    id2: string,
  ): Promise<{
    person1: PersonViewRaw;
    person2: PersonViewRaw;
    common: PersonViewRaw[];
  }> {
    const pk1 = `PERSON#u${id1}`;
    const pk2 = `PERSON#u${id2}`;

    // 1) Perfiles
    const [p1Res, p2Res] = await Promise.all([
      dynamo_client.send(
        new GetCommand({
          TableName: "SocialGraph",
          Key: { pk: pk1, sk: "PROFILE" },
        }),
      ),
      dynamo_client.send(
        new GetCommand({
          TableName: "SocialGraph",
          Key: { pk: pk2, sk: "PROFILE" },
        }),
      ),
    ]);

    if (!p1Res.Item) throw AppError.notFound(`Person ${id1} not found`);
    if (!p2Res.Item) throw AppError.notFound(`Person ${id2} not found`);

    const person1: PersonViewRaw = {
      name: p1Res.Item.name,
      nickname: p1Res.Item.nickname,
      residence: p1Res.Item.residence,
    };

    const person2: PersonViewRaw = {
      name: p2Res.Item.name,
      nickname: p2Res.Item.nickname,
      residence: p2Res.Item.residence,
    };

    // 2) Relaciones (solo IDs del otro)
    const [r1Res, r2Res] = await Promise.all([
      dynamo_client.send(
        new QueryCommand({
          TableName: "SocialGraph",
          KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
          ExpressionAttributeValues: { ":pk": pk1, ":sk": "REL#" },
        }),
      ),
      dynamo_client.send(
        new QueryCommand({
          TableName: "SocialGraph",
          KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
          ExpressionAttributeValues: { ":pk": pk2, ":sk": "REL#" },
        }),
      ),
    ]);
    const ids1 = new Set(
      (r1Res.Items ?? [])
        .map((x: any) => (x.sk.split("u")[1] ?? "").trim())
        .filter(Boolean),
    );

    const ids2 = new Set(
      (r2Res.Items ?? [])
        .map((x: any) => (x.sk.split("u")[1] ?? "").trim())
        .filter(Boolean),
    );

    
    // 3) Intersección
    const commonIds: string[] = [];
    for (const fid of ids1) {
      if (ids2.has(fid)) commonIds.push(fid);
    }

    if (commonIds.length === 0) {
      return { person1, person2, common: [] };
    }

    // 4) BatchGet perfiles de amigos comunes (máx 100 keys por request)
    const keys = commonIds.slice(0, 100).map((fid) => ({
      pk: `PERSON#u${fid}`,
      sk: "PROFILE",
    }));

    const batch = await dynamo_client.send(
      new BatchGetCommand({
        RequestItems: {
          SocialGraph: {
            Keys: keys,
            ProjectionExpression: "#n, nickname, residence, pk",
            ExpressionAttributeNames: { "#n": "name" },
          },
        },
      }),
    );

    const common: PersonViewRaw[] = (batch.Responses?.SocialGraph ?? []).map(
      (it: any) => ({
        name: it.name,
        nickname: it.nickname,
        residence: it.residence,
        // si quieres devolver el id también, lo sacas de it.pk
      }),
    );

    return { person1, person2, common };
  }
}
