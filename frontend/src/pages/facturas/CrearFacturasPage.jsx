import { Box, Heading, FormControl, FormLabel, Input, Select, Button, useToast, InputGroup, InputLeftElement, VStack, Grid, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../componentes/header";
import Sidebar from "../../componentes/Sidebar";
import { usePacientes } from "../../hooks/usePacientes";
import PacienteSelect from "../../componentes/pacienteSelect";
import FechaComponent from "../../componentes/fechaInputComponent";
import NumeroInputComponent from "../../componentes/numeroInputComponent";

const CrearFactura = () => {
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

  const pacientes = usePacientes();

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
                <PacienteSelect pacientes={pacientes} value={formData.paciente_id} onChange={handleChange} />

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

                <NumeroInputComponent label="Punto de venta" name="punto_de_venta" value={formData.punto_de_venta} onChange={handleChange} placeholder="00002" isRequired={true}/>

                <NumeroInputComponent label="Número de factura" name="numero_factura" value={formData.numero_factura} onChange={handleChange} placeholder="0000007" isRequired={true}/>

                <NumeroInputComponent label="Monto" name="monto" value={formData.monto} onChange={handleChange} placeholder="23456,78" isRequired={true}/>

                <FechaComponent label="Inicio de periodo facturado" name="fecha_facturada" value={formData.fecha_facturada} onChange={handleChange} isRequired={true}/>
                
                <FechaComponent label="Fecha emisión" name="fecha_emision" value={formData.fecha_emision} onChange={handleChange} isRequired={true}/>

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