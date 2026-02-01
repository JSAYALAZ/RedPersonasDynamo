import { RelationRepository } from "../../domain/ports/RelationRepository";
import { Relation } from "../../domain/model/Relation";
import { dynamo_client } from "@/modules/aws/infra/AwsClient";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

function createRelationItem(
  fromId: string,
  type: string,
  to: { id: string; name: string },
) {
  const type_clean = type.toUpperCase()
  const uid = to.id.split("#")[1];
  return {
    pk: fromId,
    sk: `REL#${type_clean}#PERSON#${uid}`,
    entityType: "REL",
    typeGroup: type_clean,
    importance: 0,
    partner: to.name
  };
}
export class DyRelation implements RelationRepository {
  async createSymmetricRelation(input: Relation): Promise<void> {
    const item1 = createRelationItem(input.id1, input.type, {
      id: input.id2,
      name: input.name2,
    });
    const item2 = createRelationItem(input.id2, input.type, {
      id: input.id1,
      name: input.name1,
    });
    await Promise.all([
      dynamo_client.send(
        new PutCommand({ TableName: "SocialGraph", Item: item1 }),
      ),
      dynamo_client.send(
        new PutCommand({ TableName: "SocialGraph", Item: item2 }),
      ),
    ]);
  }
}
