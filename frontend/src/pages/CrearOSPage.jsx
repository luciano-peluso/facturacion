import React, { useState } from "react";
import Header from "../componentes/header";
import { Card, CardBody, Container, FormControl, FormLabel, Heading, Input, Button, useToast } from "@chakra-ui/react";
import axios from "axios";

const CrearOSPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    cuit: "",
  });
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/os", formData); 
      toast({
        title: "Éxito",
        description: "La obra social ha sido creada exitosamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({ nombre: "", cuit: "" }); // Reinicia el formulario
    } catch (error) {
      console.error("Error al crear la obra social:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la obra social. Por favor, inténtalo de nuevo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Header />
      <Container maxW={"container.xl"} mt={"10px"}>
        <Card>
          <CardBody>
            <Heading pb={5}>Crear una Obra Social</Heading>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Nombre o Abreviatura</FormLabel>
                <Input
                  type="text"
                  name="nombre"
                  placeholder="Ej. OSDE, Galeno, Swiss Medical."
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>CUIT</FormLabel>
                <Input
                  type="text"
                  name="cuit"
                  placeholder="Sin guiones ni simbolos. Ej. 30546741253"
                  value={formData.cuit}
                  onChange={handleInputChange}
                />
              </FormControl>

              <Button 
                mt={4} 
                colorScheme="green" 
                type="submit"
                isDisabled={!formData.nombre || !formData.cuit} // Deshabilita si los campos están vacíos
              >
                Crear Obra Social
              </Button>
            </form>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default CrearOSPage;
