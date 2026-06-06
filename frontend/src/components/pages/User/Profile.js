import api from "../../../utils/api";

import { useState, useEffect } from "react";

import styles from "./Profile.module.css";

import formStyles from "../../form/Form.module.css";
import Input from "../../form/Input";

import useFlashMessage from "../../../hooks/useFlashMessage";

import RoundedImage from "../../layout/RoundedImage";

// Remova o [token] do useState e o header manual
function Profile() {
  const [user, setUser] = useState({});
  const [preview, setPreview] = useState();
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    // 2. Faz a chamada passando o token direto no objeto de configuração da requisição
    api
      .get("/users/checkuser", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar usuário:", error.response.data);
      });
  }, []);

  function onFileChange(e) {
    setPreview(e.target.files[0]);
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  }

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let msgType = "success";

    const formData = new FormData();

    await Object.keys(user).forEach((key) => formData.append(key, user[key]));

    const data = await api
      .patch(`/users/edit/${user._id}`, formData, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        msgType = "error";
        return error.response.data;
      });

    setFlashMessage(data.message, msgType);
  }

  return (
    <section>
      <div className={styles.profile_header}>
        <h1>Perfil</h1>
        {(user.image || preview) && (
          <RoundedImage
            src={
              preview
                ? URL.createObjectURL(preview)
                : `${process.env.REACT_APP_API}/image/users/${user.image}`
            }
            alt={user.name}
          />
        )}
      </div>
      <form onSubmit={handleSubmit} className={formStyles.form_container}>
        <Input
          text="Imagem"
          type="file"
          name="image"
          handleOnChange={onFileChange}
        />
        <Input
          text="Nome"
          type="name"
          name="name"
          handleOnChange={handleChange}
          placeholder="Digite seu nome"
          value={user.name || ""}
        />
        <Input
          text="Email"
          type="email"
          name="email"
          handleOnChange={handleChange}
          placeholder="Digite seu e-mail"
          value={user.email || ""}
        />
        <Input
          text="Telefone"
          type="name"
          name="phone"
          handleOnChange={handleChange}
          placeholder="Digite seu telefone"
          value={user.phone || ""}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          handleOnChange={handleChange}
          placeholder="Digite sua senha"
        />
        <Input
          text="Confirmação de senha"
          type="password"
          name="confirmpassword"
          handleOnChange={handleChange}
          placeholder="Confirme sua senha"
        />
        <input type="submit" value="Editar" />
      </form>
    </section>
  );
}

export default Profile;
