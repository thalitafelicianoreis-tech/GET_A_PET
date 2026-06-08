const UserService = require("../services/UserService");
const {
  registerSchema,
  loginSchema,
  updateSchema,
} = require("../validators/userValidator");
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = class UserController {
  static async register(req, res) {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({ message: result.error.issues[0].message });
    }

    try {
      const newUser = await UserService.register(result.data);
      await createUserToken(
        newUser,
        req,
        res,
        "Usuário cadastrado com sucesso!",
      );
    } catch (error) {
      res.status(422).json({ message: error.message });
    }
  }

  static async login(req, res) {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({ message: result.error.issues[0].message });
    }

    try {
      const { email, password } = result.data;
      const user = await UserService.login(email, password);
      await createUserToken(user, req, res, "Você está autenticado!");
    } catch (error) {
      res.status(422).json({ message: error.message });
    }
  }

  static async checkUser(req, res) {
    try {
      const token = getToken(req);
      const decoded = jwt.verify(token, "JWT_token");

      const currentUser = await UserService.findById(decoded.id);

      return res.status(200).json(currentUser);
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        message: "Token inválido!",
      });
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await UserService.findById(req.params.id);
      res.status(200).json({ user });
    } catch (error) {
      res.status(422).json({ message: error.message });
    }
  }

  static async editUser(req, res) {
    const id = req.params.id;
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (!user)
      return res.status(422).json({ message: "Usuário não encontrado!" });

    const result = updateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({ message: result.error.issues[0].message });
    }

    try {
      const updatedUser = await UserService.editUser(
        id,
        result.data,
        req.file,
        user,
      );
      await createUserToken(
        updatedUser,
        req,
        res,
        "Usuário atualizado com sucesso!",
      );
    } catch (error) {
      res.status(422).json({ message: error.message });
    }
  }
};
