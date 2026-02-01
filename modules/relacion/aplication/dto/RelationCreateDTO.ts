import z from "zod";

export const RelationCreateDTO = z.object({
    id1: z.string(),
    id2: z.string(),
    type: z.string(),
});
export type RelationCreateDTO = z.infer<typeof RelationCreateDTO>;
