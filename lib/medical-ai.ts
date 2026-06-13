import { z } from "zod";

export const mediSnapSchema = z.object({
  is_medicine_image: z.boolean(),
  confidence: z.number().min(0).max(1),
  visible_evidence: z.array(z.string()).max(8).default([]),
  name: z.string().default(""),
  use: z.string().default(""),
  dosage_general: z.string().default(""),
  timing_general: z.string().default(""),
  with_alcohol: z.string().default(""),
  alternatives: z.array(z.string()).max(5).default([]),
  common_side_effects: z.array(z.string()).max(10).default([]),
  warnings: z.array(z.string()).max(10).default([]),
  disclaimer: z.string(),
});

export const prescriptionSchema = z.object({
  is_prescription_image: z.boolean(),
  confidence: z.number().min(0).max(1),
  visible_evidence: z.array(z.string()).max(8).default([]),
  patient_name: z.string().default(""),
  medicines: z
    .array(
      z.object({
        name: z.string().default("Unclear"),
        dose: z.string().default("Unclear"),
        frequency: z.string().default("Unclear"),
        timing: z.string().default("Unclear"),
        duration: z.string().default("Unclear"),
      })
    )
    .max(30)
    .default([]),
  notes: z.string().default(""),
  disclaimer: z.string(),
});
