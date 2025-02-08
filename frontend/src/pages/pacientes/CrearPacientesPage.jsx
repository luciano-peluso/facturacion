import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  VStack,
  Grid,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import Header from "../../componentes/header";
import Sidebar from "../../componentes/Sidebar";

const CrearPacientePage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    obra_social_id: "",
    tutor_id: "",
  });
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
      setFormData({ nombre: "", dni: "", obra_social_id: "", tutor_id: "" }); // Limpiar el formulario después de crear
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
            Crear un Paciente
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <Grid templateColumns="repeat(2, 1fr)" gap={6} w="100%">
                <FormControl isRequired>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    type="text"
                    name="nombre"
                    placeholder="Ej. Juan Pérez"
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

                <FormControl>
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
              </Grid>

              <Button
                mt={6}
                colorScheme="green"
                type="submit"
                size="lg"
                w="100%"
                isDisabled={!formData.nombre || !formData.dni || !formData.obra_social_id}
              >
                Crear Paciente
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default CrearPacientePage;