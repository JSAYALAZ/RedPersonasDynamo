import { Persona } from "../model/Persona";

export type PersonListRaw = {
  PK: string;
  name: string;
  nickname: string;
  residence: string;
};
export type PersonViewRaw = {
  nickname: string;
  name: string;
  residence: string;
};
export type RelationRaw = {
  importance: number;
  otherId: string;
  typeGroup: string;
  partnerName: string;
};
export interface PersonRepository {
  createUser(input: Persona): Promise<void>;
  list(): Promise<PersonListRaw[]>;
  view(
    id: number,
  ): Promise<{ person: PersonViewRaw; relations: RelationRaw[] } | null>;
  intyect(): Promise<void>;

  mostRelationalPerson(): Promise<{
    person: PersonViewRaw;
    relations: RelationRaw[];
  }>;
  commonFriends(id1:string, id2:string): Promise<{
    person1: PersonViewRaw;
    person2: PersonViewRaw;
    common: PersonViewRaw[];
  }>;
}
