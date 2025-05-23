import { Box, Heading, FormControl, FormLabel, Input, Select, Button, useToast, InputGroup, InputLeftElement, VStack, Grid, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../componentes/header";
import Sidebar from "../../componentes/Sidebar";
import React from "react";

const CrearFactura = () => {
  const [pacientes, setPacientes] = useState([]);
  const [obrasSocialesUnPaciente, setObrasSocialesUnPaciente] = useState([]);
  const toast = useToast();
  const [formData, setFormData] = useState({
    paciente_id: "",
    paciente_obra_social_id: null,
    punto_de_venta: "",
    numero_factura: "",
    monto: "",
    estado: "false",
    fecha_emision: "",
    fecha_facturada: "",
    es_consultorio: "false",
    fecha_cobro: null,
  });

  const traerPacientes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/pacientes");
      if (!response) {
        console.error("Error en la respuesta al traer los pacientes:", error);
      }
      setPacientes(response.data.data);
    } catch (error) {
      console.error("Error al traer los pacientes:", error);
    }
  };

  const traerObrasSocialesUnPaciente = async (pid) => {
    try {
      const response = await axios.get('http://localhost:3000/api/pacienteobrasocial/'+pid);
      setObrasSocialesUnPaciente(response.data.data);
    } catch (error) {
      console.error("Error al traer las obras sociales del paciente: ", error);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (event) => {
    const value = event.target.value;
    const sanitizedValue = value.replace(",", ".");
    setFormData({
      ...formData,
      monto: sanitizedValue,
    });
  };

  const formattedValue = formData.monto.replace(".", ",");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/facturas", formData);
      toast({
        title: "Factura creada",
        description: "La factura se ha creado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error al crear la factura:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la factura. Inténtalo nuevamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setFormData({
      paciente_id: "",
      punto_de_venta: "",
      numero_factura: "",
      monto: "",
      estado: "false",
      fecha_emision: "",
      fecha_facturada: "",
      es_consultorio: "false",
      fecha_cobro: null,      
    });
  };

  useEffect(() => {
    traerPacientes();
  }, []);

  useEffect(() => {
    if(formData.paciente_id){
      traerObrasSocialesUnPaciente(formData.paciente_id);
    }
  }, [formData]);

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
            Crear una factura
          </Heading>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <Grid templateColumns="repeat(2, 1fr)" gap={6} w="100%">
                <FormControl isRequired>
                  <FormLabel>Paciente</FormLabel>
                  <Select
                    placeholder="Selecciona un paciente"
                    name="paciente_id"
                    value={formData.paciente_id}
                    onChange={handleChange}
                  >
                    {pacientes.map((paciente) => (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.nombre}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Obra Social</FormLabel>
                  <Select
                    placeholder="Selecciona una obra social del paciente"
                    name="paciente_obra_social_id"
                    value={formData.paciente_obra_social_id}
                    isDisabled={!formData.paciente_id}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        paciente_obra_social_id: e.target.value,
                      }))}>
                    {obrasSocialesUnPaciente
                      .map(unaObraSocial => (
                        <option key={unaObraSocial.id} value={unaObraSocial.id}>
                          {unaObraSocial.obra_social ? unaObraSocial.obra_social.nombre : "Particular"}
                        </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Punto de venta</FormLabel>
                  <Input
                    type="text"
                    name="punto_de_venta"
                    placeholder="Ej. 00002"
                    value={formData.punto_de_venta}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Número de factura</FormLabel>
                  <Input
                    type="text"
                    name="numero_factura"
                    placeholder="Ej. 0000007"
                    value={formData.numero_factura}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Monto</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.500" fontSize="1.2em">
                      $
                    </InputLeftElement>
                    <Input
                      type="text"
                      value={formattedValue}
                      placeholder="23456,78"
                      onChange={handleNumberChange}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Inicio de periodo facturado</FormLabel>
                  <Input
                    type="date"
                    name="fecha_facturada"
                    value={formData.fecha_facturada}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Fecha emisión</FormLabel>
                  <Input
                    type="date"
                    name="fecha_emision"
                    value={formData.fecha_emision}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>¿Consultorio o a domicilio?</FormLabel>
                  <Select
                    name="es_consultorio"
                    value={formData.es_consultorio}
                    onChange={handleChange}
                  >
                    <option value="true">Consultorio</option>
                    <option value="false">A domicilio</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                  >
                    <option value="true">Cobrado</option>
                    <option value="false">Pendiente</option>
                  </Select>
                </FormControl>

                {formData.estado === "true" && (
                  <FormControl isRequired>
                    <FormLabel>Fecha cobro</FormLabel>
                    <Input
                      type="date"
                      name="fecha_cobro"
                      value={formData.fecha_cobro || ""}
                      onChange={handleChange}
                    />
                  </FormControl>
                )}
              </Grid>

              <Button
                mt={6}
                colorScheme="green"
                type="submit"
                size="lg"
                w="100%"
                isDisabled={
                  !formData.paciente_id || 
                  !formData.punto_de_venta || 
                  !formData.numero_factura || 
                  !formData.monto || 
                  !formData.fecha_facturada || 
                  !formData.fecha_emision
                }
              >
                Crear Factura
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default CrearFactura;