import { PersonVIewDTO, RelationDTO } from "../dto/PersonVIewDTO";
import {
  PersonRepository,
  RelationRaw,
} from "../../domain/ports/PersonRepository";
import { PersonSearchCommand } from "../command/PersonSearchCommand";
import { AppError } from "@/src/utils/ApiErrorHandler";

export class MostRelationalPersonHandler {
  constructor(private readonly repo: PersonRepository) {}
  async execute(): Promise<PersonVIewDTO> {
    const data = await this.repo.mostRelationalPerson();
    if (!data) throw AppError.notFound("Usuario no encontrado");
    const map: Map<string, RelationRaw[]> = new Map();
    for (const rel of data.relations) {
      if (!map.has(rel.typeGroup)) {
        map.set(rel.typeGroup, []);
      }
      map.get(rel.typeGroup)?.push(rel);
    }
    const relations: RelationDTO[] = [];
    for (const [type, rels] of map) {
      relations.push({
        type: type,
        partners: rels.map((r) => ({
          importante: r.importance,
          id: r.otherId,
          name: r.partnerName,
        })),
      });
    }

    return {
      name: data.person.name,
      nickname: data.person.nickname,
      pk: `PERSON#u${data.person.name}`,
      residence: data.person.residence,
      relations,
    };
  }
}
