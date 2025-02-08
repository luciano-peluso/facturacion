import React, { useEffect, useState } from "react";
import Header from "../../componentes/header";
import { Box, Button, Container, FormLabel, Heading, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import axios from "axios";
import Sidebar from "../../componentes/Sidebar";


const VerTutoresPage = () => {
    const [tutorActualizado, setTutorActualizado] = useState({});
    const [tutores, setTutores] = useState([]);
    const toast = useToast();
    const {isOpen, onOpen, onClose } = useDisclosure();

    const traerTutores = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/tutores');
            setTutores(response.data.data);
        } catch (error) {
            console.log("Hubo un error al traer los tutores: ", error);
        }
    }

    const eliminar = async(tid) => {
        try {
            const response = await axios.delete('http://localhost:3000/api/tutores/borrar/'+tid);
            traerTutores();
            toast({
                title: "Éxito",
                description: "Se eliminó con éxito el tutor.",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
        } catch (error){
            console.log("No se pudo borrar el tutor", error);
            toast({
                title: "Error",
                description: "No se puedo eliminar el tutor.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTutorActualizado((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (tutor) => {
        setTutorActualizado(tutor);
        console.log(tutor);
        onOpen();  // Abrir la modal
    };

    const handleActualizar = async (tid, tutorActualizado) => { 
        try {
            const response = await axios.put('http://localhost:3000/api/tutores/actualizar/'+tid, tutorActualizado);
            console.log("Tutor con ID: ", tid, " actualizado con exito: ", response.data);
            onClose();
            traerTutores();
            toast({
                title: "Éxito",
                description: "El encargado ha sido actualizado exitosamente.",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
        } catch (error) {
            console.error("Error al editar al encargado: ", error);
            toast({
                title: "Error",
                description: "El encargado no se ha podido editar.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
        }
    }

    useEffect(() =>{
        traerTutores();
    },[]);

    return(
        <Box className="container" display="flex" w={"100%"} minW={"1300px"} maxW={"1400px"}>
        <Sidebar />

        {/* Main Dashboard */}
        <Box className="dashboard" overflow={"hidden"} flex="1" p={4}>
            <Header mensaje={"Bienvenido, usuario"}/>

            {/* Buscador */}
            <Input placeholder="🔍 Buscar por nombre, DNI..." />

            <Box className="latest-invoices" w="100%" overflowX="auto" marginTop={"15px"}>
                <Heading size="md" mb={2}>Últimas Facturas</Heading>
                <Table variant="simple" size="sm" minW="1000px" borderRadius={"10"}>
                    <Thead >
                        <Tr>
                            <Th textAlign={"center"} color={"white"}>ID</Th>
                            <Th textAlign={"center"} color={"white"}>Nombre</Th>
                            <Th textAlign={"center"} color={"white"}>DNI</Th>
                            <Th textAlign={"center"} color={"white"}>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {tutores.length > 0 ? (
                        tutores.map((tutor) => (
                            <Tr key={tutor.id}>
                                <Td>{tutor.id}</Td>
                                <Td>{tutor.nombre}</Td>
                                <Td>{tutor.dni}</Td>
                                <Td maxW="140px">
                                    <HStack spacing={1} justifyContent={"center"}>
                                        <Button size="sm" title="Editar" onClick={() => handleEditClick(tutor)}
                                        _hover={{ bg:"#008E6D" }} bg={"green.100"}>✏️</Button>
                                        <Button size="sm" title="Borrar" onClick={() => eliminar(tutor.id)}
                                        _hover={{ bg:"#008E6D" }} bg={"green.100"}>🗑️</Button>
                                    </HStack>
                                </Td>
                            </Tr>
                        )) 
                        ) : 
                        <Tr>
                            <Td colSpan="4" textAlign="center">No hay encargados cargados en el sistema</Td>
                        </Tr> }
                    </Tbody>
                    </Table>
                </Box>
                <Modal isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Editar un encargado</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <VStack alignItems={"start"}>
                                            <FormLabel>Nombre
                                            <Input 
                                                placeholder="Nombre"
                                                name="nombre"
                                                value={tutorActualizado.nombre}
                                                onChange={handleChange}
                                                minW={"200px"}/></FormLabel>
        
                                            <FormLabel>Número de DNI
                                            <Input 
                                                placeholder="Numero de DNI"
                                                name="dni"
                                                value={tutorActualizado.dni}
                                                onChange={handleChange}
                                                minW={"200px"}/></FormLabel>
                                        </VStack>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button colorScheme="green" mr={3} 
                                            onClick={() => handleActualizar(tutorActualizado.id, tutorActualizado)}>
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
    )

}

export default VerTutoresPage;