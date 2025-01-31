import { Container, Card, CardBody, Heading, FormControl, FormLabel, Input, NumberInput, NumberInputField, Select, Button, useToast, InputGroup, InputLeftElement, } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../componentes/header";
  
  const CrearFactura = () => {
    const [pacientes, setPacientes] = useState([]);
    const toast = useToast();
    const [formData, setFormData] = useState({
      paciente_id: "",
      punto_de_venta: "",
      numero_factura: "",
      monto: '',
      estado: "false",
      fecha_emision: "",
      fecha_facturada: "",
      es_consultorio: "false",
      fecha_cobro: "",
    });

    const traerPacientes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/pacientes');
        if(!response) {
          console.error("Error en la respuesta al traer los pacientes:", error);
        }
        setPacientes(response.data.data);
      } catch (error) {
        console.error("Error al traer los pacientes:", error);
      }
    } 

  
    // Manejar cambios en los inputs
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    // Manejar cambios en el NumberInput
    const handleNumberChange = (event) => {
      const value = event.target.value;
  
      // Reemplaza comas por puntos para manejar decimales
      const sanitizedValue = value.replace(',', '.');
  
      // Actualiza el estado con el valor sanitizado
      setFormData({
        ...formData,
        monto: sanitizedValue,
      });
    };
  
    const formattedValue = formData.monto.replace('.', ',');
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
      setFormData({paciente_id: "",
        punto_de_venta: "",
        numero_factura: "",
        monto: '',
        estado: "false",
        fecha_emision: "",
        fecha_facturada: "",
        es_consultorio: "false",
        fecha_cobro: "",
      });
    };
  
    useEffect(() => {
      traerPacientes();
    },[]);

    return (
        <>
        <Header></Header>
      <Container maxW={"container.xl"} mt={"10px"}>
        <Card>
          <CardBody>
            <Heading pb={5}>Crear una factura</Heading>
            <FormControl>
              <FormControl isRequired mt={4}>
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
                </Select></FormControl>
              
              <FormControl isRequired mt={4}>
              <FormLabel>Punto de venta</FormLabel>
                <Input
                  type="text"
                  name="punto_de_venta"
                  placeholder="Ej. 00002"
                  value={formData.punto_de_venta}
                  onChange={handleChange}
                /></FormControl>

              
              <FormControl isRequired mt={4}>
              <FormLabel>Número de factura</FormLabel>
              <Input
                type="text"
                name="numero_factura"
                placeholder="Ej. 0000007"
                value={formData.numero_factura}
                onChange={handleChange}
              /></FormControl>
  
  
              <FormLabel>Monto</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents='none' color='gray.500' fontSize='1.2em'>
                  $
                </InputLeftElement>
                  <Input
                    type="text" // Usamos type="text" para permitir comas 
                    value={formattedValue} // Muestra el valor con comas
                    placeholder="23456,78"
                    onChange={handleNumberChange}
                  /></InputGroup>
                           
              <FormControl isRequired mt={4}>
              <FormLabel>Inicio de periodo facturado</FormLabel>
              <Input
                type="date"
                name="fecha_facturada"
                value={formData.fecha_facturada}
                onChange={handleChange}
              /></FormControl>

              
              <FormControl isRequired mt={4}>
              <FormLabel>Fecha emision</FormLabel>
              <Input
                type="date"
                name="fecha_emision"
                value={formData.fecha_emision}
                onChange={handleChange}
              /></FormControl>

              <FormControl isRequired mt={4}>
              <FormLabel>¿Consultorio o particular?</FormLabel>
              <Select
                name="es_consultorio"
                value={formData.es_consultorio}
                onChange={handleChange}
              >
                <option value="true">Consultorio</option>
                <option value="false">Particular</option>
              </Select></FormControl>

              <FormControl isRequired mt={4}>
              <FormLabel>Estado</FormLabel>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="true">Cobrado</option>
                <option value="false">Pendiente</option>
              </Select></FormControl>

              {formData.estado === "true" ? 
              <FormControl isRequired mt={4}>
              <FormLabel>Fecha cobro</FormLabel>
              <Input
                type="date"
                name="fecha_cobro"
                value={formData.fecha_cobro}
                onChange={handleChange}
              /></FormControl>
              : <>{formData.fecha_cobro = null}</>}
              
  
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
  