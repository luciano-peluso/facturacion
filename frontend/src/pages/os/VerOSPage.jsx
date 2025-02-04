import React, { useEffect, useState } from "react";
import Header from "../../componentes/header";
import { Box, Button, Card, Container, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr, VStack, useToast, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Input, ModalFooter, FormLabel, Select } from "@chakra-ui/react";
import axios from "axios";

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

    return (<>
    <Header />
    <Container maxW="container.xl" py={8}>
        <Heading as="h1" size="lg" mb={6}>
            Listado de Obras sociales
        </Heading>
        <Box overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
            <Table variant="striped" size="md">
                <Thead>
                    <Tr>
                        <Th>Nombre o Abreviatura</Th>
                        <Th>CUIT</Th>
                        <Th>Clasificacion</Th>
                        <Th>Mail</Th>
                        <Th>Telefono</Th>
                        <Th textAlign={"center"}>Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {obrasSociales.map((obraSocial) => (
                        <Tr key={obraSocial.id}>
                            <Td>{obraSocial.nombre}</Td>
                            <Td>{obraSocial.cuit}</Td>
                            <Td>{obraSocial.clasificacion}</Td>
                            <Td>{obraSocial.mail? `${obraSocial.mail}`: `No hay un mail cargado`}</Td>
                            <Td>{obraSocial.telefono? `${obraSocial.telefono}`: `No hay un numero de telefono cargado`}</Td>
                            <Td>
                                <HStack spacing={"2"} justifyContent={"center"}>
                                    <Button
                                        size={"md"} 
                                        colorScheme="red"
                                        onClick={() => eliminar(obraSocial.id)}
                                    >
                                        X
                                    </Button>
                                    <Button colorScheme="blue" 
                                        onClick={() => handleEditClick(obraSocial)}>
                                        Editar
                                    </Button>
                                </HStack>
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
    </Container>
    </>
)}

export default VerOSPage