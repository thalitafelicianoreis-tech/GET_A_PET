const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

module.exports = class UserService {
  static async register({ name, email, phone, password }) {
    const userExist = await User.findOne({ email });
    if (userExist) throw new Error("E-mail já cadastrado!");

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, phone, password: passwordHash });
    return await user.save();
  }

  static async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Usuário não cadastrado!");

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) throw new Error("Senha incorreta!");

    return user;
  }

  static async findById(id) {
    const user = await User.findById(id).select('-password');
    if (!user) throw new Error("Usuário não encontrado!");
    return user;
  }

  static async editUser(id, userData, file, currentUser) {
    const { name, email, phone, password, confirmpassword } = userData;

    if (file) currentUser.image = file.filename;

    // Verificar se o e-mail novo já pertence a outra pessoa
    const userExists = await User.findOne({ email });
    if (userExists && userExists._id.toString() !== id) {
      throw new Error("Por favor, utilize outro e-mail. Este já está cadastrado!");
    }

    currentUser.name = name;
    currentUser.email = email;
    currentUser.phone = phone;

    if (password && password === confirmpassword) {
      const salt = await bcrypt.genSalt(12);
      currentUser.password = await bcrypt.hash(password, salt);
    }

    return await User.findOneAndUpdate(
      { _id: currentUser._id },
      { $set: currentUser },
      { new: true }
    );
  }
};