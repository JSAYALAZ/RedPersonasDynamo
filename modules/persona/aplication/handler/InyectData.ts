import { PersonListDTO } from "../dto/PersonListDTO";
import { PersonRepository } from "../../domain/ports/PersonRepository";
import { PersonListCommand } from "../command/PersonListCommand";

export class InyectDataHandler {
  constructor(private readonly repo: PersonRepository) {}
  async execute(command: PersonListCommand): Promise<void> {
    await this.repo.intyect();
  }
}
