import React, { useState } from "react";
import Header from "../componentes/header";
import { Container, Card, CardBody, Heading, FormControl, FormLabel, Input, Button, useToast } from "@chakra-ui/react";
import axios from "axios";


const CrearTutoresPage = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        dni: "",
      });
      const toast = useToast();

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post("http://localhost:3000/api/tutores", formData); 
          toast({
            title: "Éxito",
            description: "El tutor ha sido creado exitosamente.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setFormData({ nombre: "", dni: "" }); // Reinicia el formulario
        } catch (error) {
          console.error("Error al crear el tutor:", error);
          toast({
            title: "Error",
            description: "No se pudo crear el tutor. Por favor, inténtalo de nuevo.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      };

    return(
        <>
        <Header />
        <Container maxW={"container.xl"} mt={"10px"}>
        <Card>
          <CardBody>
            <Heading pb={5}>Crear un Tutor</Heading>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Nombre</FormLabel>
                <Input
                  type="text"
                  name="nombre"
                  placeholder="Ej. Fernando Burlando."
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

              <Button 
                mt={4} 
                colorScheme="green" 
                type="submit"
                isDisabled={!formData.nombre || !formData.dni} // Deshabilita si los campos están vacíos
              >
                Crear tutor
              </Button>
            </form>
          </CardBody>
        </Card>
      </Container>
        </>
    )

}

export default CrearTutoresPage;