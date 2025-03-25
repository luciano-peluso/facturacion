import React, { useEffect, useState } from "react";
import { Box, Heading, FormControl, FormLabel, Input, Select, Button, useToast, VStack, Grid, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";
import Header from "../../componentes/header";
import Sidebar from "../../componentes/Sidebar";

const CrearOSPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    cuit: "",
    mail: "",
    telefono: "",
    condicion_iva_id: "",
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
      const response = await axios.post("http://localhost:3000/api/os", formData);
      toast({
        title: "Éxito",
        description: "La obra social ha sido creada exitosamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({ nombre: "", cuit: "", mail: "", telefono: "", condicion_iva_id: "" }); // Reinicia el formulario
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
  useEffect( () => {
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
            Crear una Obra Social
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <Grid templateColumns="repeat(2, 1fr)" gap={6} w="100%">
                <FormControl isRequired>
                  <FormLabel>Nombre o Abreviatura</FormLabel>
                  <Input
                    type="text"
                    name="nombre"
                    placeholder="Ej. OSDE, Galeno, Swiss Medical"
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>CUIT</FormLabel>
                  <Input
                    type="text"
                    name="cuit"
                    placeholder="Sin guiones ni símbolos. Ej. 30546741253"
                    value={formData.cuit}
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

                <FormControl>
                  <FormLabel>Mail</FormLabel>
                  <Input
                    type="email"
                    name="mail"
                    placeholder="ayuda@obrasocial.com.ar"
                    value={formData.mail}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Teléfono</FormLabel>
                  <Input
                    type="text"
                    name="telefono"
                    placeholder="11 1234-5678"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>

              <Button
                mt={6}
                colorScheme="green"
                type="submit"
                size="lg"
                w="100%"
                isDisabled={!formData.nombre || !formData.cuit || !formData.condicion_iva_id}
              >
                Crear Obra Social
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default CrearOSPage;