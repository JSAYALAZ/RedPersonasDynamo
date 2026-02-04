import { PersonCreateDTO } from "../aplication/dto/PersonCreateDTO";
import { PersonListDTO } from "../aplication/dto/PersonListDTO";
import { PersonVIewDTO } from "../aplication/dto/PersonVIewDTO";
import { CreatePersonHandler } from "../aplication/handler/CreatePersonHandler";
import { InyectDataHandler } from "../aplication/handler/InyectData";
import { ListPersonasHandler } from "../aplication/handler/ListPersonasHandler";
import { SearchPersonaHandler } from "../aplication/handler/SearchPersonaHandler";

export class PersonController {
  constructor(
    private readonly createP: CreatePersonHandler,
    private readonly listP: ListPersonasHandler,
    private readonly searchP: SearchPersonaHandler,
    private readonly inyect: InyectDataHandler,
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
}
