import z, { string } from "zod";

export const RelationDTO = z.object({
  type: z.string(),
  partners: z.array(z.object({
    id:z.string(),
    name:z.string(),
    importante: z.number(),
  })),
})
export type RelationDTO = z.infer<typeof RelationDTO>;
export const PersonVIewDTO = z.object({
  pk: z.string(),
  name: z.string(),
  nickname: z.string(),
  residence: z.string(),
  relations: z.array(RelationDTO),
});

export type PersonVIewDTO = z.infer<typeof PersonVIewDTO>;
