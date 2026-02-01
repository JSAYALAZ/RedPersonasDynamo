import { RelationController } from "./RelationController";
import { CreateRelationHandler } from "../aplication/handler/CreateRelationHandler";
import { DyRelation } from "../infra/aws/RelationDynamo";
import { DyUser } from "@/modules/persona/infra/aws/PersonDynamo";

export function buildRelationController() {
  const db = new DyRelation();
  const dbperson = new DyUser();
  const createHandler = new CreateRelationHandler(db,dbperson);
  return new RelationController(createHandler);
}
