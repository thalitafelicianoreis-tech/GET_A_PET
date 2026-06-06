import { useState } from "react";

import Input from "./Input";
import formStyles from "./Form.module.css";
import Select from "./Select";
import { useEffect } from "react";

function PetForm({ handleSubmit, btnText, petData }) {
  const [pet, setPet] = useState({
    name: "",
    age: "",
    weight: "",
    color: "",
    image: "",
  });

  useEffect(() => {
    if (petData) {
      setPet(petData);
    }
  }, [petData]);
  const [preview, setPreview] = useState([]);
  const color = [
    "Branco",
    "Preto",
    "Caramelo",
    "Marrom",
    "Beige",
    "Mesclado",
    "Cinza",
  ];

  function onFileChange(e) {
    setPreview(Array.from(e.target.files));
    setPet({ ...pet, images: [...e.target.files] });
  }
  function handleChange(e) {
    setPet({ ...pet, [e.target.name]: e.target.value });
  }
  function handleColor(e) {
    setPet({ ...pet, color: e.target.options[e.target.selectedIndex].text });
  }

  function submit(e) {
    e.preventDefault();
    console.log(pet);
    handleSubmit(pet);
  }

  return (
    <form onSubmit={submit} className={formStyles.form_container}>
      <div className={formStyles.preview_pet_images}>
        {preview.length > 0
          ? preview.map((image, index) => (
              <img
                src={URL.createObjectURL(image)}
                alt={pet.name}
                key={`${pet.name} + ${index}`}
              />
            ))
          : pet.images &&
            pet.images.map((image, index) => (
              <img
                src={`${process.env.REACT_APP_API}/image/pets/${image}`}
                alt={pet.name}
                key={`${pet.name} + ${index}`}
              />
            ))}
      </div>
      <Input
        text="Imagens do Pet"
        type="file"
        name="images"
        handleOnChange={onFileChange}
        multiple={true}
      />
      <Input
        text="Nome do Pet"
        type="text"
        name="name"
        placeholder="Digite o nome"
        handleOnChange={handleChange}
        value={pet.name || ""}
      />
      <Input
        text="Idade do Pet"
        type="number"
        name="age"
        placeholder="Digite a idade"
        handleOnChange={handleChange}
        value={pet.age || ""}
      />
      <Input
        text="Peso do Pet"
        type="text"
        name="weight"
        placeholder="Digite o peso"
        handleOnChange={handleChange}
        value={pet.weight || ""}
      />

      <Select
        name="color"
        text="Selecione a cor"
        options={color}
        handleOnChange={handleColor}
        value={pet.color || ""}
      />

      <input type="submit" value={btnText} />
    </form>
  );
}

export default PetForm;
