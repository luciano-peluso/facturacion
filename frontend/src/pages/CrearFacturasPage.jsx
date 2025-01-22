import {
    Container,
    Card,
    CardBody,
    Heading,
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    Select,
    Button,
    useToast,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import axios from "axios";
import Header from "../componentes/header";
  
  const CrearFactura = () => {
    const [formData, setFormData] = useState({
      paciente: "",
      os: "",
      num_factura: "",
      valor: 0,
      estado: "false",
      fecha: "",
    });
  
    const toast = useToast();
  
    // Manejar cambios en los inputs
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    // Manejar cambios en el NumberInput
    const handleNumberChange = (valueAsNumber) => {
      setFormData((prev) => ({ ...prev, valor: valueAsNumber }));
    };
  
    // Enviar los datos al backend
    const handleSubmit = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/facturas", formData);
        toast({
          title: "Factura creada",
          description: "La factura se ha creado correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        console.log("Respuesta del servidor:", response.data);
      } catch (error) {
        console.error("Error al crear la factura:", error);
        toast({
          title: "Error",
          description: "No se pudo crear la factura. Inténtalo nuevamente.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
  
    return (
        <>
        <Header></Header>
      <Container maxW={"container.xl"} mt={"10px"}>
        <Card>
          <CardBody>
            <Heading pb={5}>Crear una factura</Heading>
            <FormControl>
              <FormLabel>Nombre de Paciente</FormLabel>
              <Input
                type="text"
                name="paciente"
                placeholder="Ej. Luis Quinteros"
                value={formData.paciente}
                onChange={handleChange}
              />
  
              <FormLabel>Obra Social</FormLabel>
              <Input
                type="text"
                name="os"
                placeholder="Ej. OSDE"
                value={formData.os}
                onChange={handleChange}
              />
  
              <FormLabel>Número de factura</FormLabel>
              <Input
                type="text"
                name="num_factura"
                placeholder="Ej. 0000007"
                value={formData.num_factura}
                onChange={handleChange}
              />
  
              <FormLabel>Monto</FormLabel>
              <NumberInput
                value={formData.valor}
                min={0}
                precision={2}
                onChange={(_, valueAsNumber) => handleNumberChange(valueAsNumber)}
              >
                <NumberInputField />
              </NumberInput>
  
              <FormLabel>Estado</FormLabel>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="true">Cobrado</option>
                <option value="false">Pendiente</option>
              </Select>
  
              <FormLabel>Fecha</FormLabel>
              <Input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
              />
  
              <Button
                mt={4}
                colorScheme="green"
                onClick={handleSubmit}
              >
                Crear Factura
              </Button>
            </FormControl>
          </CardBody>
        </Card>
      </Container>
      </>
    );
  };
  
  export default CrearFactura;
  