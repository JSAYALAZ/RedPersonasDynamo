import z from "zod";

export const PersonCreateDTO = z.object({
    email: z.string(),
    name: z.string(),
    nickname: z.string(),
    residence: z.string(),
});
export type PersonCreateDTO = z.infer<typeof PersonCreateDTO>;
