import React, { useEffect, useState } from "react";
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
  Select,
  Grid,
} from "@chakra-ui/react";
import axios from "axios";
import Header from "../../componentes/header";
import Sidebar from "../../componentes/Sidebar";

const CrearTutoresPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    condicion_iva_id: ""
  });
  const toast = useToast();
  const [condicionesIva, setCondicionesIva] = useState([]);
  const traerCondicionesIva = async () => {
      try {
          const response = await axios.get('http://localhost:3000/api/condicionIva');
          setCondicionesIva(response.data.data);
      } catch (error){
          console.log("Error al traer las obras sociales: ", error);
      }
  }
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
  useEffect(() => {
    traerCondicionesIva();
  }, []);
  // Colores para el fondo y la sombra
  const bgColor = useColorModeValue("white", "gray.700");
  const shadow = useColorModeValue("md", "dark-lg");

  return (
    <Box className="container" display="flex" w="100%">
      <Sidebar />

      <Box className="dashboard" overflow="auto" flex="1" p={4}>
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
            Crear un Tutor
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <Grid templateColumns="repeat(2, 1fr)" gap={6} w="100%">
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

                <FormControl isRequired>
                <FormLabel>Clasificación</FormLabel>
                <Select
                  placeholder="Seleccione una clasificación de contribuyente"
                  name="condicion_iva_id"
                  value={formData.condicion_iva_id}
                  onChange={handleInputChange}
                >
                  {condicionesIva.map(condicionIva => (
                    <option key={condicionIva.id} value={condicionIva.id}>
                      {condicionIva.descripcion}
                    </option>
                  ))}
                </Select>
              </FormControl>
              </Grid>
                <Button
                  mt={6}
                  colorScheme="green"
                  type="submit"
                  size="lg"
                  w="100%"
                  isDisabled={!formData.nombre || !formData.dni || !formData.condicion_iva_id}
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