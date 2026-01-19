import * as z from "zod";

export const EnergyDTO = z.object({
  voltage: z.float32(),
  current: z.float32(),
  power: z.float32(),
});

export const EnergyEntity = z.object({
  measureId: z.uuidv4(),
  voltage: z.float32(),
  current: z.float32(),
  power: z.float32(),
  createdTime: z.date()
});

export type EnergyType = z.infer<typeof EnergyEntity>;