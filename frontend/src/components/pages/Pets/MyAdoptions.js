import api from "../../../utils/api";

import { useState, useEffect } from "react";

import RoundedImage from "../../layout/RoundedImage";

import styles from "./Dashboard.module.css";

import { Link } from "react-router-dom";

function MyAdoptions() {
  const [pets, setPets] = useState([]);
  const [token] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    api
      .get("/pets/myadoptions/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPets(response.data.pets);
        console.log(pets);
      });
  }, [token]);

  return (
    <section>
      <div className={styles.petlist_header}>
        <h1>Minhas adoções</h1>
      </div>
      <div className={styles.petlist_container}>
        {pets.length > 0 &&
          pets.map((pet) => (
            <div className={styles.petlist_row} key={pet._id}>
              <RoundedImage
                src={`${process.env.REACT_APP_API}/image/pets/${pet.images[0]}`}
                alt={pet.name}
                width="px75"
              />
              <span className="bold">{pet.name}</span>
              <div className={styles.contacts}>
                <p>
                  <span className="bold">Ligue para: </span>
                  {pet.user.phone}
                </p>
                <p>
                  <span className="bold">Fale com: </span>
                  {pet.user.name}
                </p>
              </div>
              <div className={styles.actions}>
                {pet.available ? (
                  <p>Adoção em processo</p>
                ) : (
                  <p>Parabéns por concluir a adoção</p>
                )}
              </div>
            </div>
          ))}

        {pets.length === 0 && (
          <p>
            Não há adoções de Pets{" "}
            <Link to="/">Clique aqui para adotar um Pet</Link>{" "}
          </p>
        )}
      </div>
    </section>
  );
}
export default MyAdoptions;
