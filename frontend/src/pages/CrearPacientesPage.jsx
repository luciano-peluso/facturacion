import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, Heading, FormControl, FormLabel, Input, Select, Button, useToast, } from "@chakra-ui/react";
import axios from "axios";
import Header from "../componentes/header";

const CrearPacientePage = () => {
  const [formData, setFormData] = useState({ nombre: "", dni: "", obra_social_id: "", tutor_id: ""});
  const [obrasSociales, setObrasSociales] = useState([]);
  const [tutores, setTutores] = useState([]);
  const toast = useToast();

  const traerObrasSociales = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/os");
      setObrasSociales(response.data.data);
    } catch (error) {
      console.error("Error al traer las obras sociales:", error);
    }
  };

  const traerTutores = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/tutores");
      setTutores(response.data.data);
    } catch (error) {
      console.error("Error al traer los tutores:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/pacientes", formData);
      toast({
        title: "Éxito",
        description: "Paciente creado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({ nombre: "", dni: "", obra_social_id: "", tutor_id: ""}); // Limpiar el formulario después de crear
    } catch (error) {
      console.error("Error al crear el paciente:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el paciente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  useEffect(() => {
    traerObrasSociales();
    traerTutores();
  }, []);

  return (
    <>
    <Header></Header>
    <Container maxW={"container.xl"} mt={"10px"}>
      <Card>
        <CardBody>
          <Heading pb={5}>Crear un Paciente</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                name="nombre"
                placeholder="Ej. Juan Pérez."
                value={formData.nombre}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>DNI</FormLabel>
              <Input
                type="text"
                name="dni"
                placeholder="Sin puntos. Ej. 45678901"
                value={formData.dni}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Obra Social</FormLabel>
              <Select
                placeholder="Selecciona una obra social"
                name="obra_social_id"
                value={formData.obra_social_id}
                onChange={handleInputChange}
              >
                {obrasSociales.map((obra) => (
                  <option key={obra.id} value={obra.id}>
                    {obra.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tutor</FormLabel>
              <Select
                placeholder="Sin tutor"
                name="tutor_id"
                value={formData.tutor_id}
                onChange={handleInputChange}
              >
                {tutores.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button
              mt={4}
              colorScheme="green"
              type="submit"
              isDisabled={!formData.nombre || !formData.dni || !formData.obra_social_id}
            >
              Crear Paciente
            </Button>
          </form>
        </CardBody>
      </Card>
    </Container>
    </>
  );
};

export default CrearPacientePage;