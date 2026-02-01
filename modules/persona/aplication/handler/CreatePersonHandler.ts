import { PersonRepository } from "../../domain/ports/PersonRepository";
import { ICountPersons } from "@/modules/persona/domain/ports/ICountPersons";
import { Persona } from "../../domain/model/Persona";
import { PersonCreateCommand } from "../command/PersonCreateCommand";

export class CreatePersonHandler {
  constructor(
    private readonly repo: PersonRepository,
    private readonly counter: ICountPersons,
  ) {}

  async execute(command: PersonCreateCommand): Promise<number> {
    const input = command.input;

    const id = await this.counter.count();

    const client = Persona.create({
      email: input.email,
      name: input.name,
      nickname: input.nickname,
      residence: input.residence,
      id:id + 1,
    });
    await this.repo.createUser(client);
    return id;
  }
}
