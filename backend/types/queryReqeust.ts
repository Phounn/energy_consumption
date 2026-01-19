import z from "zod";

export const QueryRequest= z.object({
    offset: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),

})

export type QueryRequestType = z.infer<typeof QueryRequest>;