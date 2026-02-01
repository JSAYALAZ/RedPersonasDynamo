import { PersonListDTO } from "../dto/PersonListDTO";
import { PersonRepository } from "../../domain/ports/PersonRepository";
import { PersonListCommand } from "../command/PersonListCommand";

export class ListPersonasHandler {
  constructor(private readonly repo: PersonRepository) {}
  async execute(command: PersonListCommand): Promise<PersonListDTO> {
    const items = await this.repo.list();
    return {
      items: items.map((data) => ({
        id: data.PK,
        name: data.name,
        nickname: data.nickname,
        residence: data.residence,
      })),
    };
  }
}
