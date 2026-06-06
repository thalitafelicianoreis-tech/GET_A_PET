const { z } = require("zod");

const createSchema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório!"),
  age: z
    .string()
    .min(1, "O campo idade é obrigatório!")
    .transform((value) => Number(value)),
  weight: z
    .string()
    .min(1, "O campo peso é obrigatório!")
    .transform((value) => Number(value)),
  color: z.string().min(1, "O campo cor é obrigatório!"),
});

const updateSchema = createSchema;

module.exports = { createSchema, updateSchema };
