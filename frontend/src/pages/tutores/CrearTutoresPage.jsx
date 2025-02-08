import React, { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import Header from "../../componentes/header";
import Sidebar from "../../componentes/Sidebar";

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

  // Colores para el fondo y la sombra
  const bgColor = useColorModeValue("white", "gray.700");
  const shadow = useColorModeValue("md", "dark-lg");

  return (
    <Box className="container" display="flex" w="100%" minW="1400px">
      <Sidebar />

      <Box className="dashboard" overflow="hidden" flex="1" p={4}>
        <Header />

        <Box
          maxW="800px"
          mx="auto"
          mt={8}
          p={8}
          bg={bgColor}
          boxShadow={shadow}
          borderRadius="lg"
        >
          <Heading size="lg" mb={6} textAlign="center">
            Crear un Encargado
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Nombre</FormLabel>
                <Input
                  type="text"
                  name="nombre"
                  placeholder="Ej. Fernando Burlando"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired>
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
                mt={6}
                colorScheme="green"
                type="submit"
                size="lg"
                w="100%"
                isDisabled={!formData.nombre || !formData.dni}
              >
                Crear Tutor
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default CrearTutoresPage;