import React, { useState } from "react";
import Header from "../../componentes/header";
import { Card, CardBody, Container, FormControl, FormLabel, Heading, Input, Button, useToast, Select } from "@chakra-ui/react";
import axios from "axios";

const CrearOSPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    cuit: "",
    mail: "",
    telefono: "",
    clasificacion: ""
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
      setFormData({ nombre: "", cuit: "", mail: "", telefono: "" }); // Reinicia el formulario
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
              <FormControl isRequired mt={4}>
                <FormLabel>Clasificación</FormLabel>
                <Select
                  value={formData.clasificacion} // El valor actual seleccionado
                  onChange={(e) => setFormData({ ...formData, clasificacion: e.target.value })} // Actualiza el estado cuando se elige una opción
                  placeholder="Seleccione una clasificacion de contribuyente"
                >
                  <option value="Responsable Inscripto">Responsable Inscripto</option>
                  <option value="Sujeto Exento">Sujeto Exento</option>
                  <option value="Consumidor Final">Consumidor Final</option>
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Mail</FormLabel>
                <Input
                  type="email"
                  name="mail"
                  placeholder="ayuda@obrasocial.com.ar"
                  value={formData.mail}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Telefono</FormLabel>
                <Input
                  type="text"
                  name="telefono"
                  placeholder="11 1234-5678"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              </FormControl>
              <Button 
                mt={4} 
                colorScheme="green" 
                type="submit"
                isDisabled={!formData.nombre || !formData.cuit || !formData.clasificacion }  // Deshabilita si los campos están vacíos
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
