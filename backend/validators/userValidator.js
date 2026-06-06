const { z } = require("zod");

// Criamos o schema de registro
const registerSchema = z
  .object({
    name: z
      .string({ required_error: "O campo nome é obrigatório!" })
      .min(1, "O campo nome é obrigatório!"),
    email: z
      .string({ required_error: "O campo email é obrigatório!" })
      .min(1, "O e-mail é obrigatório!")
      .email("Formato de e-mail inválido!"),
    phone: z
      .string({ required_error: "O campo telefone é obrigatório!" })
      .min(1, "O telefone é obrigatório!")
      .regex(/^\d{2}\d{8,9}$/, "Telefone inválido!"),
    password: z
      .string({ required_error: "O campo senha é obrigatório!" })
      .trim()
      .min(8, "A senha deve ter no mínimo 8 caracteres!"),
    confirmpassword: z
      .string({ required_error: "O campo confirmação de senha é obrigatório!" })
      .min(1, "A confirmação de senha é obrigatória!"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "As senhas não coincidem!",
    path: ["confirmpassword"],
  });

const loginSchema = z.object({
  email: z
    .string({ required_error: "O campo nome é obrigatório!" })
    .min(1, "Preencha o campo e-mail")
    .email("Formato de e-mail inválido!"),
  password: z
    .string({ required_error: "O campo senha é obrigatório!" })
    .min(1, "Preencha o campo senha!"),
});

const updateSchema = z
  .object({
    name: z.string().min(1, "O campo nome é obrigatório!"),
    email: z
      .string()
      .email("Formato de e-mail inválido!")
      .min(1, "O e-mail é obrigatório!"),
    phone: z
      .string()
      .min(1, "O telefone é obrigatório!")
      .regex(/^\d{2}9?\d{9}$/, "Telefone inválido!"),
    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres!")
      .optional()
      .or(z.literal("")),
    confirmpassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // Se o usuário digitou algo na senha, ele deve confirmar corretamente
      if (data.password && data.password.trim() !== "") {
        return data.password === data.confirmpassword;
      }
      return true;
    },
    {
      message: "As senhas não coincidem!",
      path: ["confirmpassword"],
    },
  );

module.exports = { registerSchema, loginSchema, updateSchema };
