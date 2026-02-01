import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
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
}
