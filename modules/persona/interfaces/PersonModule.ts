import { PersonController } from "./PersonController";
import { ListPersonasHandler } from "../aplication/handler/ListPersonasHandler";
import { SearchPersonaHandler } from "../aplication/handler/SearchPersonaHandler";
import { CreatePersonHandler } from "../aplication/handler/CreatePersonHandler";
import { DyUser } from "../infra/aws/PersonDynamo";
import { InyectDataHandler } from "../aplication/handler/InyectData";

export function buildPersonController() {
  const db = new DyUser();
  const createHandler = new CreatePersonHandler(db, db);
  const listHandler = new ListPersonasHandler(db);
  const searchHandler = new SearchPersonaHandler(db);
  const inyectHandler = new InyectDataHandler(db);
  return new PersonController(createHandler, listHandler, searchHandler,inyectHandler);
}
