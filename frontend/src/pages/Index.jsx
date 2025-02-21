import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Button, Input, Menu, Table, Thead, Tbody, Tr, Th, Td, Flex, MenuButton, MenuList, VStack, MenuItem, HStack, useDisclosure, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormLabel, Select, InputGroup, InputLeftElement, ModalFooter } from "@chakra-ui/react";
import Header from "../componentes/header";
import Sidebar from "../componentes/Sidebar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Index = () => {
    const [facturas, setFacturas] = useState([]);
    const [busqueda, setBusqueda] = useState(""); // Estado para el texto del buscador
    const toast = useToast();
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [rangoPrecision, setRangoPrecision] = useState([]);
    const [facturaActualizada, setFacturaActualizada] = useState({
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
    const [facturasFiltradas, setFacturasFiltradas] = useState([]);

    
    const buscarPares = () => {
        const rangoMinimo = parseFloat(busqueda) * (1 - rangoPrecision / 100);
        const rangoMaximo = parseFloat(busqueda) * (1 + rangoPrecision / 100);

        // Ahora llamamos a la función buscarPares para buscar las facturas que sean pares dentro del rango
        const facturasPendientes = facturas.filter(f => !f.estado);
        const facturasPorPaciente = facturasPendientes.reduce((acc, factura) => {
          if (!acc[factura.paciente_id]) {
            acc[factura.paciente_id] = [];
          }
          acc[factura.paciente_id].push(factura);
          return acc;
        }, {});
      
        let facturasResultado = [];
      
        Object.entries(facturasPorPaciente).forEach(([paciente_id, facturasDelPaciente]) => {
          if (facturasDelPaciente.length >= 2) {
            for (let i = 0; i < facturasDelPaciente.length - 1; i++) {
              for (let j = i + 1; j < facturasDelPaciente.length; j++) {
                const valor1 = parseFloat(facturasDelPaciente[i].monto);
                const valor2 = parseFloat(facturasDelPaciente[j].monto);
                const suma = valor1 + valor2;
                if (suma >= rangoMinimo && suma <= rangoMaximo) {
                  facturasResultado.push(facturasDelPaciente[i], facturasDelPaciente[j]);
                }
              }
            }
          }
        });
        // Combinar las facturas filtradas con las de los pares encontrados
        const resultadoFinal = [...facturasResultado];
        // Ordenar el resultado final
        resultadoFinal.sort((a, b) => {
          if (a.paciente_id < b.paciente_id) return -1;
          if (a.paciente_id > b.paciente_id) return 1;
          return 0;
        });
        
        setFacturasFiltradas(resultadoFinal);

      };    

    const eliminar = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/facturas/borrar/${id}`);
            console.log(`Factura con ID ${id} eliminada:`, response.data);
            traerFacturas();
            toast({
                title: "Éxito",
                description: "La factura ha sido eliminada exitosamente.",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
        } catch (error) {
            console.error("Error al eliminar la factura:", error);
            toast({
                title: "Error",
                description: "La factura no se ha podido eliminar.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
        }
    }

    const traerFacturas = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/facturas");
            const facturasSorted = response.data.data.sort((a, b) => new Date(b.fecha_emision) - new Date(a.fecha_emision));
            setFacturas(facturasSorted);
            setFacturasFiltradas(facturasSorted);
        } catch (error) {
            console.log("Error al traer las facturas: ", error);
        }
    };

    const marcarCobrada = async (id) => {
        try {
            const hoy = new Date();
            const response = await axios.put(`http://localhost:3000/api/facturas/cobrar/${id}`, {
                estado: true,
                fecha_cobro: hoy,
            });
            console.log(`Factura con ID ${id} marcada como cobrada:`, response.data);
    
            // Si necesitas actualizar el listado en tu frontend después de marcarla como cobrada:
            traerFacturas(); // O actualiza el estado de facturas si lo tienes.
        } catch (error) {
            console.error("Error al marcar la factura como cobrada:", error);
        }
    }

    const obtenerRangoPrecision = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/configuracion');
            setRangoPrecision(response.data.data.rango_precision);
        } catch (error) {
            console.error("Error al traer el rango precision. Dejandolo en default...");
            setRangoPrecision(10);
        }
    }

    const handleActualizar = async (fid, facturaActualizada) => { 
        try {
            const response = await axios.put('http://localhost:3000/api/facturas/actualizar/'+fid, facturaActualizada);
            console.log("Factura con ID: ", fid, " actualizada con exito: ", response.data);
            onClose();
            traerFacturas();
            toast({
                title: "Éxito",
                description: "La factura ha sido editada exitosamente.",
                status: "success",
                duration: 3000,
                isClosable: true,
                });
        } catch (error) {
            console.error("Error al editar la factura: ", error);
            toast({
                title: "Error",
                description: "La factura no se ha podido editar.",
                status: "error",
                duration: 3000,
                isClosable: true,
                });
        }
    }
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === "estado" ? value === "true" : value;
    
        setFacturaActualizada((prevState) => ({
            ...prevState,
            [name]: newValue,
            ...(name === "estado" && !newValue ? { fecha_cobro: "" } : {}), // Si estado es false, limpiar fecha_cobro
        }));
    };
    
    const handleMontoChange = (event) => {
        const inputValue = event.target.value;

        // Filtra los caracteres no deseados (solo permite números y una coma)
        const filteredValue = inputValue.replace(/[^0-9,]/g, '');
        
        // Asegúrate de que solo haya una coma
        const parts = filteredValue.split(',');
        if (parts.length > 2) {
            // Si hay más de una coma, no actualices el estado
            return;
        }

        // Actualiza el estado con el valor filtrado
        setFacturaActualizada({
            ...facturaActualizada,
            monto: filteredValue,
        });
    };

    const handleEditClick = (factura) => {
        setFacturaActualizada(factura);
        console.log(factura);
        onOpen();  // Abrir la modal
    };

    const traerPacientes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/pacientes');
            setPacientes(response.data.data);
        } catch (error) {
            console.error("Error al traer los pacientes:", error);
        }
    }

    useEffect(() => {
        traerFacturas();
        traerPacientes();
        obtenerRangoPrecision();
    }, []);

    useEffect(() => {
        const facturasFiltradas = facturas.filter((factura) =>
            (factura.numero_factura || "").includes(busqueda) ||
            factura.paciente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            factura.paciente.obra_social.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            (factura.paciente.obra_social.cuit || "").includes(busqueda) ||
            (factura.monto || "").includes(busqueda) ||
            (factura.paciente.tutor?.nombre || "").includes(busqueda) ||
            (factura.paciente.tutor?.dni || "").includes(busqueda)
        );
        setFacturasFiltradas(facturasFiltradas);
    }, [busqueda, facturas]);


  return (
    <Box className="container" display="flex" w={"100%"}>
      <Sidebar />

        {/* Main Dashboard */}
        <Box className="dashboard" overflow={"hidden"} flex="1" p={4}>
            <Header mensaje={"Bienvenido, usuario"}/>
            
            <HStack>
                {/* Buscador */}
                <Input placeholder="🔍 Buscar factura, paciente, obra social..." 
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <Button size={"md"} colorScheme="green" onClick={() => buscarPares()}>
                    Buscar pares
                </Button>
            </HStack>

            <Box className="latest-invoices" w="100%" overflowX="auto" marginTop={"15px"}>
                <Heading size="md" mb={2}>Últimas Facturas</Heading>
                <Table variant="simple" size="sm" minW="1000px" borderRadius={"10"}>
                    <Thead >
                    <Tr>
                        <Th padding={"15px"} color={"white"}>N° Factura</Th>
                        <Th color={"white"}>Paciente</Th>
                        <Th color={"white"}>Obra Social</Th>
                        <Th color={"white"}>Encargado</Th>
                        <Th color={"white"}>Valor</Th>
                        <Th color={"white"}>Período Facturado</Th>
                        <Th color={"white"}>Fecha de Emisión</Th>
                        <Th color={"white"}>Cobrado</Th>
                        <Th color={"white"}>Acciones</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    {facturasFiltradas.length > 0 ? (
                                facturasFiltradas.map((factura) => {
                                    const { paciente, numero_factura, monto, fecha_facturada, fecha_emision, estado, id } = factura;
                                    const obraSocial = paciente?.obra_social;
                                    const tutor = paciente?.tutor;

                                    return (
                                    <Tr key={id}>
                                        <Td>{numero_factura}</Td>
                                        <Td>{paciente ? paciente.nombre : "Eliminado"}</Td>
                                        <Td maxW={"200px"}>{obraSocial ? `${obraSocial.nombre} (CUIT: ${obraSocial.cuit})` : "Eliminada"}</Td>
                                        <Td>{tutor ? `${tutor.nombre} (DNI: ${tutor.dni})` : "Sin cuidador o encargado"}</Td>
                                        <Td>${monto}</Td>
                                        <Td>
                                            {fecha_facturada
                                                ? format(new Date(fecha_facturada + "T12:00:00Z"), "MMMM yyyy", { locale: es })
                                                    .replace(/^\w/, (c) => c.toUpperCase())
                                                : "Fecha no disponible"}
                                        </Td>
                                        <Td>
                                            {fecha_emision
                                                ? format(new Date(fecha_emision + "T12:00:00Z"), "dd/MM/yyyy", { locale: es })
                                                : "Fecha no disponible"}
                                        </Td>
                                        <Td>{estado ? "Sí" : "No"}</Td>
                                        <Td maxW="140px">
                                            <HStack spacing={1}>
                                                <Button size="sm" title="Cobrar" onClick={() => marcarCobrada(factura.id)} 
                                                _hover={{ bg:"#008E6D" }} bg={"green.100"} isDisabled={factura.estado}>💰</Button>
                                                <Button size="sm" title="Editar" onClick={() => handleEditClick(factura)}
                                                _hover={{ bg:"#008E6D" }} bg={"green.100"}>✏️</Button>
                                                <Button size="sm" title="Borrar" onClick={() => eliminar(factura.id)}
                                                _hover={{ bg:"#008E6D" }} bg={"green.100"}>🗑️</Button>
                                            </HStack>
                                        </Td>
                                    </Tr>
                                );
                            })
                        ) : (
                            <Tr>
                                <Td colSpan={9} textAlign="center">No hay facturas registradas</Td>
                            </Tr>
                        )} 
                    </Tbody>
                </Table>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                          <ModalHeader>Editar Factura</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                          <VStack spacing={1}>
                              {/* Select de Pacientes */}
                              <FormLabel htmlFor="paciente_id">Paciente</FormLabel>
                              <Select
                              name="paciente_id"
                              value={facturaActualizada.paciente_id}
                              onChange={handleChange}
                              placeholder="Selecciona un paciente"
                              >
                              {pacientes.map((paciente) => (
                                  <option key={paciente.id} value={paciente.id}>
                                  {paciente.nombre} {paciente.apellido}
                                  </option>
                              ))}
                              </Select>
      
                              {/* Número de factura */}
                              <FormLabel>Número de factura</FormLabel>
                              <Input
                              type="text"
                              name="numero_factura"
                              placeholder="Ej. 0000007"
                              value={facturaActualizada.numero_factura}
                              onChange={handleChange}
                              />
      
                              <FormLabel>Monto</FormLabel>
                              <InputGroup>
                                  <InputLeftElement pointerEvents="none" color="gray.500" fontSize="1.2em">
                                      $
                                  </InputLeftElement>
                                  <Input
                                      type="text"
                                      value={facturaActualizada.monto || ""}
                                      placeholder="23456,78"
                                      onChange={handleMontoChange}
                                  />
                              </InputGroup>
      
                              {/* Fecha de facturación */}
                              <FormLabel htmlFor="fecha_facturada">Fecha de facturación</FormLabel>
                              <Input
                              placeholder="Fecha de facturación"
                              name="fecha_facturada"
                              type="date"
                              value={facturaActualizada.fecha_facturada}
                              onChange={handleChange}
                              />
      
                              {/* Fecha de emisión */}
                              <FormLabel htmlFor="fecha_emision">Fecha de emisión</FormLabel>
                              <Input
                              placeholder="Fecha de emisión"
                              name="fecha_emision"
                              type="date"
                              value={facturaActualizada.fecha_emision}
                              onChange={handleChange}
                              />
      
                              {/* Consultorio */}
                              <FormLabel>¿Consultorio o particular?</FormLabel>
                              <Select
                              name="es_consultorio"
                              value={facturaActualizada.es_consultorio}
                              onChange={handleChange}
                              >
                              <option value="true">Consultorio</option>
                              <option value="false">Particular</option>
                              </Select>
      
                              <FormLabel htmlFor="estado">Estado</FormLabel>
                              <Select
                              name="estado"
                              value={facturaActualizada.estado ? "true" : "false"}  // Usamos "true" y "false" como valores de cadena
                              onChange={handleChange}
                              >
                              <option value="false">Pendiente</option>
                              <option value="true">Cobrada</option>
                              </Select>
      
                              {/* Si el estado es "Cobrada", mostrar la fecha de cobro */}
                              {facturaActualizada.estado && (
                              <>
                                  <FormLabel htmlFor="fecha_cobro">Fecha de cobro</FormLabel>
                                  <Input
                                  placeholder="Fecha de cobro"
                                  name="fecha_cobro"
                                  type="date"
                                  value={facturaActualizada.fecha_cobro}
                                  onChange={handleChange}
                                  />
                              </>
                              )}
                          </VStack>
                          </ModalBody>
                          <ModalFooter>
                          <Button
                              colorScheme="green"
                              mr={3}
                              onClick={() => handleActualizar(facturaActualizada.id, facturaActualizada)}
                          >
                              Actualizar
                          </Button>
                          <Button variant={"ghost"} onClick={onClose}>
                              Cancelar
                          </Button>
                          </ModalFooter>
                      </ModalContent>
            </Modal>
        </Box>
    </Box>
  );
};

export default Index;
