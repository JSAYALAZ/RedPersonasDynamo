import { RelationCreateDTO } from "../aplication/dto/RelationCreateDTO";
import { CreateRelationHandler } from "../aplication/handler/CreateRelationHandler";

export class RelationController {
  constructor(private readonly createP: CreateRelationHandler) {}

  async create(params: { body: unknown }): Promise<void> {
    const input = RelationCreateDTO.parse(params.body);

    const id = await this.createP.execute({
      input,
    });
  }
}
