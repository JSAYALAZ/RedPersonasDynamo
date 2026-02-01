import { RelationRepository } from "../../domain/ports/RelationRepository";
import { Relation } from "../../domain/model/Relation";
import { RelationCreateCommand } from "../command/RelationCreateCommand";
import { RelationType } from "../../domain/enum/RelationType";
import { GetUserNameRepository } from "../../domain/ports/GetUserNameRepository";

export class CreateRelationHandler {
  constructor(
    private readonly repo: RelationRepository,
    private readonly userRepo: GetUserNameRepository,
  ) {}

  async execute(command: RelationCreateCommand): Promise<void> {
    const input = command.input;
    const name1 = await this.userRepo.getNameById(input.id1);
    const name2 = await this.userRepo.getNameById(input.id2);

    const relation = Relation.create({
      id1: input.id1,
      name1,
      id2: input.id2,
      type: input.type as RelationType,
      name2,
    });
    await this.repo.createSymmetricRelation(relation);
  }
}
