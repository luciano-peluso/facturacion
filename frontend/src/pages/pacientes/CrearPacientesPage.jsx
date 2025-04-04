import React, { useState, useEffect } from "react";
import { Box, Heading, FormControl, FormLabel, Input, Select, Button, useToast, VStack, Grid, Tag, TagLabel, TagCloseButton, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";
import Header from "../../componentes/header";
import Sidebar from "../../componentes/Sidebar";

const CrearPacientePage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    tutor_id: "",
    obrasSocialesSeleccionadas: [],
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

  const handleAddObraSocial = (e) => {
    const value = e.target.value === "null" ? null : parseInt(e.target.value);
    if (!formData.obrasSocialesSeleccionadas.includes(value)) {
      setFormData(prev => ({
        ...prev,
        obrasSocialesSeleccionadas: [...prev.obrasSocialesSeleccionadas, value]
      }));
    }
  };

  const handleRemoveObraSocial = (obraSocialId) => {
    setFormData((prev) => ({
      ...prev,
      obrasSocialesSeleccionadas: prev.obrasSocialesSeleccionadas.filter(id => id !== obraSocialId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/pacientes", {
        nombre: formData.nombre,
        dni: formData.dni,
        tutor_id: formData.tutor_id || null,
      });
      
      const paciente_id = response.data.data.id;
      if (formData.obrasSocialesSeleccionadas.length === 0) {
        console.log("No se crea nada, si no existe relación Paciente-ObraSocial, el paciente no tiene obra social.")
      } else {
        // Crea los registros normalmente
        await Promise.all(
          formData.obrasSocialesSeleccionadas.map((obra_social_id) =>
            axios.post("http://localhost:3000/api/pacienteObraSocial", { paciente_id, obra_social_id })
          )
        );
      }
      
      toast({
        title: "Éxito",
        description: "Paciente creado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setFormData({ nombre: "", dni: "", tutor_id: "", obrasSocialesSeleccionadas: [] });
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

  const bgColor = useColorModeValue("white", "gray.700");
  const shadow = useColorModeValue("md", "dark-lg");

  return (
    <Box className="container" display="flex" w="100%">
      <Sidebar />

      <Box className="dashboard" overflow="auto" flex="1" p={4}>
        <Header />

        <Box maxW="800px" mx="auto" mt={8} p={8} bg={bgColor} boxShadow={shadow} borderRadius="lg">
          <Heading size="lg" mb={6} textAlign="center">Crear un Paciente</Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <Grid templateColumns="repeat(2, 1fr)" gap={6} w="100%">
                <FormControl isRequired>
                  <FormLabel>Nombre</FormLabel>
                  <Input type="text" name="nombre" placeholder="Ej. Juan Pérez" value={formData.nombre} onChange={handleInputChange} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>DNI</FormLabel>
                  <Input type="text" name="dni" placeholder="Sin puntos. Ej. 45678901" value={formData.dni} onChange={handleInputChange} />
                </FormControl>
              </Grid>

              <FormControl>
                <FormLabel>Obras Sociales</FormLabel>
                {formData.obrasSocialesSeleccionadas.map((obraSocialId, index) => (
                  <Tag key={index} size="lg" variant="solid" colorScheme="green" m={1}>
                    <TagLabel>
                      {
                        obraSocialId === null
                          ? "Sin obra social"
                          : obrasSociales.find(obra => String(obra.id) === String(obraSocialId))?.nombre || "Desconocido"
                      }
                    </TagLabel>
                    <TagCloseButton onClick={() => handleRemoveObraSocial(obraSocialId)} />
                  </Tag>
                ))}
                <Select placeholder="Agregar obra social" onChange={handleAddObraSocial} mt={2}>
                  <option value="null">Sin obra social</option>
                  {obrasSociales.map((obra) => (
                    <option key={obra.id} value={obra.id}>{obra.nombre}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Tutor</FormLabel>
                <Select placeholder="Sin tutor" name="tutor_id" value={formData.tutor_id} onChange={handleInputChange}>
                  {tutores.map((tutor) => (
                    <option key={tutor.id} value={tutor.id}>{tutor.nombre}</option>
                  ))}
                </Select>
              </FormControl>

              <Button mt={6} colorScheme="green" type="submit" size="lg" w="100%" isDisabled={!formData.nombre || !formData.dni}>
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
