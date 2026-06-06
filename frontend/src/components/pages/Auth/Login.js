import { useState, useContext } from "react";
import Input from "../../form/Input";
import styles from "../../form/Form.module.css";
import { Link } from "react-router-dom";

//context
import { Context } from "../../../context/UserContext";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { login } = useContext(Context);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log(user);
  }

  function handleSubmit(e) {
    e.preventDefault();
    login(user);
  }

  return (
    <section className={styles.form_container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <Input
          text="Email"
          type="email"
          name="email"
          placeholder="Digite seu e-mail"
          handleOnChange={handleChange}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite sua senha"
          handleOnChange={handleChange}
        />
        <input type="submit" value="Entrar" />
        <p>
          Não tem conta?<Link to="/register">Clique aqui</Link>{" "}
        </p>
      </form>
    </section>
  );
}

export default Login;
