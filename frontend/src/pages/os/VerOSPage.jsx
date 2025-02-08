import React, { useEffect, useState } from "react";
import Header from "../../componentes/header";
import { Box, Button, Card, Container, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr, VStack, useToast, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Input, ModalFooter, FormLabel, Select } from "@chakra-ui/react";
import axios from "axios";
import Sidebar from "../../componentes/Sidebar";

const VerOSPage = () => {
    const [obraSocialActualizada, setObraSocialActualizada] = useState({});
    const [obrasSociales, setObrasSociales] = useState([]);
    const toast = useToast();
    const {isOpen, onOpen, onClose } = useDisclosure();

    const traerObrasSociales = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/os');
            setObrasSociales(response.data.data);
            
        } catch (error){
            console.log("Error al traer las obras sociales: ", error);
        }

    }
    
    const eliminar = async (fid) => {
        try {
            const response = await axios.delete('http://localhost:3000/api/os/borrar/'+fid);
            traerObrasSociales();
            toast({
                title: "Éxito",
                description: "La obra social ha sido eliminada exitosamente.",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
        } catch (error) {
            console.log("Error al eliminar la obra social")
            toast({
                title: "Error",
                description: "La obra social no se ha podido eliminar.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setObraSocialActualizada((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (obraSocial) => {
        setObraSocialActualizada(obraSocial);
        console.log(obraSocial);
        onOpen();  // Abrir la modal
    };
    
    const handleActualizar = async (osid, obraSocialActualizada) => { 
        try {
            const response = await axios.put('http://localhost:3000/api/os/actualizar/'+osid, obraSocialActualizada);
            console.log("OS con ID: ", osid, " actualizada con exito: ", response.data);
            onClose();
            traerObrasSociales();
            toast({
                title: "Éxito",
                description: "La obra social ha sido editada exitosamente.",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
        } catch (error) {
            console.error("Error al editar la factura: ", error);
            toast({
                title: "Error",
                description: "La obra social no se ha podido editar.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
        }
    }

    useEffect(() => {
        traerObrasSociales()
    }, []);

    return(
        <Box className="container" display="flex" w={"100%"} minW={"1300px"} maxW={"1400px"}>
        <Sidebar />

        {/* Main Dashboard */}
        <Box className="dashboard" overflow={"hidden"} flex="1" p={4}>
            <Header mensaje={"Bienvenido, usuario"}/>

            {/* Buscador */}
            <Input placeholder="🔍 Buscar por nombre, CUIT, mail..." />

            <Box className="latest-invoices" w="100%" overflowX="auto" marginTop={"15px"}>
                <Heading size="md" mb={2}>Últimas Facturas</Heading>
                <Table variant="simple" size="sm" minW="1000px" borderRadius={"10"}>
                    <Thead >
                        <Tr>
                            <Th textAlign={"center"} color={"white"}>Nombre o Abreviatura</Th>
                            <Th textAlign={"center"} color={"white"}>CUIT</Th>
                            <Th textAlign={"center"} color={"white"}>Clasificacion</Th>
                            <Th textAlign={"center"} color={"white"}>Mail</Th>
                            <Th textAlign={"center"} color={"white"}>Telefono</Th>
                            <Th textAlign={"center"} color={"white"}>Acciones</Th>
                        </Tr>
                    </Thead>
                <Tbody>
                    {obrasSociales.length > 0 ? 
                    ( obrasSociales.map((obraSocial) => (
                        <Tr key={obraSocial.id}>
                            <Td>{obraSocial.nombre}</Td>
                            <Td>{obraSocial.cuit}</Td>
                            <Td>{obraSocial.clasificacion}</Td>
                            <Td>{obraSocial.mail? `${obraSocial.mail}`: `No hay un mail cargado`}</Td>
                            <Td>{obraSocial.telefono? `${obraSocial.telefono}`: `No hay un numero de telefono cargado`}</Td>
                            <Td maxW="140px">
                                <HStack spacing={1} justifyContent={"center"}>
                                    <Button size="sm" title="Editar" onClick={() => handleEditClick(obraSocial)}
                                    _hover={{ bg:"#008E6D" }} bg={"green.100"}>✏️</Button>
                                    <Button size="sm" title="Borrar" onClick={() => eliminar(obraSocial.id)}
                                    _hover={{ bg:"#008E6D" }} bg={"green.100"}>🗑️</Button>
                                </HStack>
                            </Td>
                        </Tr>
                    )) ) :
                    <Tr>
                      <Td colSpan="6" textAlign="center">No hay obras sociales cargadas en el sistema</Td>
                    </Tr>}
                </Tbody>
            </Table>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Editar un paciente</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <VStack alignItems={"start"}>
                                    <FormLabel>Nombre o Abreviatura
                                    <Input 
                                        placeholder="Nombre o Abreviatura"
                                        name="nombre"
                                        value={obraSocialActualizada.nombre}
                                        onChange={handleChange}
                                        minW={"200px"}/></FormLabel>

                                    <FormLabel>Número de CUIT
                                    <Input 
                                        placeholder="Numero de CUIT"
                                        name="cuit"
                                        value={obraSocialActualizada.cuit}
                                        onChange={handleChange}
                                        minW={"200px"}/></FormLabel>
                              
                                    <FormLabel>Clasificación</FormLabel>
                                    <Select
                                    value={obraSocialActualizada.clasificacion || ""} // El valor actual seleccionado
                                    onChange={(e) => setObraSocialActualizada({ ...obraSocialActualizada, clasificacion: e.target.value })} // Actualiza el estado cuando se elige una opción
                                    placeholder="Seleccione una clasificacion de contribuyente"
                                    >
                                    <option value="Responsable Inscripto">Responsable Inscripto</option>
                                    <option value="Sujeto Exento">Sujeto Exento</option>
                                    <option value="Consumidor Final">Consumidor Final</option>
                                    </Select>

                                    <FormLabel>Mail
                                    <Input 
                                        placeholder="ayuda@obrasocial.com.ar"
                                        name="mail"
                                        value={obraSocialActualizada.mail || ""}
                                        onChange={handleChange}
                                        minW={"200px"}/></FormLabel>

                                    <FormLabel>Número de telefono
                                    <Input 
                                        placeholder="11 1234-5678"
                                        name="telefono"
                                        value={obraSocialActualizada.telefono || ""}
                                        onChange={handleChange}
                                        minW={"200px"}/></FormLabel>
                                </VStack>
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="blue" mr={3} 
                                    onClick={() => handleActualizar(obraSocialActualizada.id, obraSocialActualizada)}>
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
)}

export default VerOSPage