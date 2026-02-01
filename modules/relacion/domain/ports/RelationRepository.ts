import { Relation } from "../model/Relation";

export interface RelationRepository {
  createSymmetricRelation(input: Relation): Promise<void>;
}
