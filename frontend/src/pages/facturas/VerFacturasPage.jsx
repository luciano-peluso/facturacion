import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Heading, HStack, Box, Button, Table, Thead, Tbody, Tr, Th, Td, InputGroup, InputLeftAddon, InputRightElement, Input, VStack, Modal, useDisclosure, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, NumberInput, NumberInputField, ModalFooter, useToast } from "@chakra-ui/react";
import { RepeatIcon } from '@chakra-ui/icons';
import Header from "../../componentes/header";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const FacturasPage = () => {
    const [facturaActualizada, setFacturaActualizada] = useState({});
    const [facturas, setFacturas] = useState([]);
    const [monto, setMonto] = useState([]);
    const {isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    const traerFacturas = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/facturas");
            const facturasSorted = response.data.data.sort((a, b) => new Date(b.fecha_emision) - new Date(a.fecha_emision));
            setFacturas(facturasSorted);
        } catch (error) {
            console.log("Error al traer las facturas: ", error);
        }
    };

    useEffect(() => {
        traerFacturas();
    }, []);

    const handleRefresh = () => {
        setMonto("");
        traerFacturas();
    };

   const handleClick = () => {
        console.log("Monto buscado:", monto);

        const montoTope = monto*1.10;
        const montoMin = monto*0.90

        
        console.log("Buscamos un monto entre:", montoTope, " y ", montoMin);

        const nuevasFacturas = facturas.filter(factura => 
            factura.monto > montoMin && factura.monto < montoTope && factura.estado === false
        );

        setFacturas(nuevasFacturas);
    };

    const buscarPares = () => {
        const rangoMinimo = monto * 0.9;
        const rangoMaximo = monto * 1.1;
        
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
                const valor2 = parseFloat(facturasDelPaciente[j].monto)
                const suma = valor1 + valor2;
                console.log(suma);
                if (suma >= rangoMinimo && suma <= rangoMaximo) {
                  facturasResultado.push(facturasDelPaciente[i], facturasDelPaciente[j]);
                }
              }
            }
          }
        });
      
        facturasResultado.sort((a, b) => {
          if (a.paciente_id < b.paciente_id) return -1;
          if (a.paciente_id > b.paciente_id) return 1;
          return 0;
        });
        
        setFacturas(facturasResultado);
     };

    const filtrarNoCobradas = () => {
        const facturasFiltradas = facturas.filter(factura => 
            factura.estado === false
        );

        setFacturas(facturasFiltradas);
    }

    const marcarCobrada = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/facturas/actualizar/${id}`, {
                estado: true,
            });
            console.log(`Factura con ID ${id} marcada como cobrada:`, response.data);
    
            // Si necesitas actualizar el listado en tu frontend después de marcarla como cobrada:
            traerFacturas(); // O actualiza el estado de facturas si lo tienes.
        } catch (error) {
            console.error("Error al marcar la factura como cobrada:", error);
        }
    }

    const eliminar = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/facturas/borrar/${id}`);
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
        setFacturaActualizada((prev) => ({ ...prev, [name]: value }));
    };
    
      const handleNumberChange = (_, valueAsNumber) => {
        setFacturaActualizada((prev) => ({ ...prev, valor: valueAsNumber }));
    };

    const handleEditClick = (factura) => {
        setFacturaActualizada(factura);
        console.log(factura);
        onOpen();  // Abrir la modal
    };
     
    
    return (
        <>
        <Header />
        <Container maxW="container.2xl" py={8}>

            <HStack mb="10" alignItems="center" spacing={2}>
            <InputGroup>
                <InputLeftAddon>$</InputLeftAddon>
                <Input
                placeholder="Ingrese un monto"
                size="md"
                width="180px"
                variant="outline"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                />
            </InputGroup>
            <Button onClick={handleClick}>Buscar</Button>
            <Button
                size="md"
                colorScheme="blue"
                onClick={handleRefresh}
            >
                <RepeatIcon />
            </Button>
            <Button
                size="md"
                colorScheme="blue"
                onClick={buscarPares}
            >
                    ¿Más de una?
            </Button>
            <Button
                size="md"
                colorScheme="red"
                onClick={filtrarNoCobradas}
            >
                    No cobradas
            </Button>
            </HStack>

            <Heading as="h1" size="lg" mb={6}>
                Listado de Facturas
            </Heading>
            <Box overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
                <Table variant="striped" size="md">
                    <Thead>
                        <Tr>
                            <Th>Nombre del Paciente</Th>
                            <Th>Obra Social</Th>
                            <Th>Representante legal</Th>
                            <Th>Numero de factura</Th>
                            <Th>Valor</Th>
                            <Th>Periodo facturado</Th>
                            <Th>Fecha de emision</Th>
                            <Th>Cobrado</Th>
                            <Th textAlign="center">Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {facturas.map((factura) => (
                            <Tr key={factura.id}>
                                <Td>{factura.paciente.nombre}</Td>
                                <Td>{factura.paciente.obra_social.nombre} (CUIT: {factura.paciente.obra_social.cuit})</Td>
                                <Td>{factura.paciente?.tutor? `${factura.paciente.tutor.nombre} (DNI: ${factura.paciente.tutor.dni})`: "Sin tutor"}</Td>
                                <Td>{factura.numero_factura}</Td>
                                <Td>${factura.monto}</Td>
                                <Td>{factura.fecha_facturada ? format(new Date(factura.fecha_facturada), "MMMM yyyy", { locale: es })
                                    .replace(/^\w/, (c) => c.toUpperCase()) : "Fecha no disponible"}</Td>
                                <Td>{factura.fecha_emision}</Td>
                                <Td>{factura.estado ? "Cobrado" : "Pendiente"}</Td>
                                <Td>
                                    <VStack>
                                        <HStack spacing={"2"} justifyContent={"center"}>
                                            {!factura.estado && ( // Mostrar el botón "Cobrar" solo si la factura está pendiente
                                                <Button
                                                    size={"md"} 
                                                    colorScheme="green"
                                                    onClick={() => marcarCobrada(factura.id)}
                                                >
                                                    Cobrar
                                                </Button>
                                            )}
                                            <Button
                                                size={"md"} 
                                                colorScheme="red"
                                                onClick={() => eliminar(factura.id)}
                                            >
                                                X
                                            </Button>
                                        </HStack>
                                        <HStack spacing={2} justifyContent={"center"}>
                                            <Button colorScheme="blue" 
                                                onClick={() => handleEditClick(factura)}>
                                                Editar
                                            </Button>
                                        </HStack>
                                    </VStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar un paciente</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack>
                            <Input 
                                placeholder="Nombre del cliente"
                                name="paciente"
                                value={facturaActualizada.paciente}
                                onChange={handleChange}/>
                            <Input 
                                placeholder="Obra social"
                                name="os"
                                value={facturaActualizada.os}
                                onChange={handleChange}/>
                            <Input 
                                placeholder="Numero de factura"
                                name="num_factura"
                                value={facturaActualizada.num_factura}
                                onChange={handleChange}/>
                            <NumberInput
                                name="valor"
                                min={0}
                                value={facturaActualizada.valor}
                                precision={2}
                                onChange={handleNumberChange}
                                >
                                <NumberInputField 
                                placeholder="Monto de la factura"/>
                            </NumberInput>
                            <Input 
                                placeholder="Fecha de la factura"
                                name="fecha"
                                type="date"
                                value={facturaActualizada.fecha}
                                onChange={handleChange}/>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} 
                            onClick={() => handleActualizar(facturaActualizada.id, facturaActualizada)}>
                            Actualizar
                        </Button>
                        <Button variant={"ghost"} onClick={onClose}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
        </>
    );
};

export default FacturasPage;