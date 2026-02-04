import { PersonRepository } from "../../domain/ports/PersonRepository";
import { AppError } from "@/src/utils/ApiErrorHandler";

export class CommonFriendsHandler {
  constructor(private readonly repo: PersonRepository) {}
  async execute(command: { id1: string; id2: string }): Promise<any> {
    const data = await this.repo.commonFriends(command.id1, command.id2);
    if (!data) throw AppError.notFound("Usuario no encontrado");
    return data;
  }
}
