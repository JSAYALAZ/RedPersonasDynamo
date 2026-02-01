import z from "zod";

export const PersonListItemDTO = z.object({
  id: z.string(),
  name: z.string(),
  nickname: z.string(),
  residence: z.string(),
});
export type PersonListItemDTO = z.infer<typeof PersonListItemDTO>;

export const PersonListDTO = z.object({
  items: z.array(PersonListItemDTO),
});
export type PersonListDTO = z.infer<typeof PersonListDTO>;
