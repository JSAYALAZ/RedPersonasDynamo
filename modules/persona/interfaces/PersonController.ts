import { PersonCreateDTO } from "../aplication/dto/PersonCreateDTO";
import { PersonListDTO } from "../aplication/dto/PersonListDTO";
import { PersonVIewDTO } from "../aplication/dto/PersonVIewDTO";
import { CommonFriendsHandler } from "../aplication/handler/CommonFriendsHandler";
import { CreatePersonHandler } from "../aplication/handler/CreatePersonHandler";
import { InyectDataHandler } from "../aplication/handler/InyectData";
import { ListPersonasHandler } from "../aplication/handler/ListPersonasHandler";
import { MostRelationalPersonHandler } from "../aplication/handler/MostRelationalPerson";
import { SearchPersonaHandler } from "../aplication/handler/SearchPersonaHandler";

export class PersonController {
  constructor(
    private readonly createP: CreatePersonHandler,
    private readonly listP: ListPersonasHandler,
    private readonly searchP: SearchPersonaHandler,
    private readonly inyect: InyectDataHandler,
    private readonly mostRelation: MostRelationalPersonHandler,
    private readonly commonFriend: CommonFriendsHandler,
  ) {}

  async create(params: { body: unknown }): Promise<number> {
    const input = PersonCreateDTO.parse(params.body);
    const id = await this.createP.execute({
      input,
    });
    return id;
  }

  async list(): Promise<PersonListDTO> {
    const items = await this.listP.execute({});
    return items;
  }
  async inyectData(): Promise<void> {
    await this.inyect.execute({});
  }
  async search(params: { personId: string }): Promise<PersonVIewDTO> {
    const resp = await this.searchP.execute({
      personId: params.personId,
    });
    return resp;
  }
  async mostRelationalPerson(): Promise<PersonVIewDTO> {
    const resp = await this.mostRelation.execute();
    return resp;
  }
  async commonFriends(params: { id1: string, id2:string }): Promise<any> {
    const resp = await this.commonFriend.execute({
      id1: params.id1,
      id2: params.id2,
    });
    return resp;
  }
}
