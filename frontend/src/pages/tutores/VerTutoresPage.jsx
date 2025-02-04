import React, { useEffect, useState } from "react";
import Header from "../../componentes/header";
import { Box, Button, Container, FormLabel, Heading, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import axios from "axios";


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
        <>
        <Header />
        <Container maxW="container.xl" py={8}>
                <Heading as="h1" size="lg" mb={6}>
                    Lista de Encargados
                </Heading>
                <Box overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
                    <Table variant="striped" size="md">
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Nombre</Th>
                                <Th>DNI</Th>
                                <Th textAlign={"center"}>Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tutores.map((tutor) => (
                                <Tr key={tutor.id}>
                                    <Td>{tutor.id}</Td>
                                    <Td>{tutor.nombre}</Td>
                                    <Td>{tutor.dni}</Td>
                                    <Td>
                                        <HStack spacing={"2"} justifyContent={"center"}>
                                            <Button
                                                size={"md"} 
                                                colorScheme="red"
                                                onClick={() => eliminar(tutor.id)}
                                            >
                                                X
                                            </Button>
                                            <Button
                                                size={"md"} 
                                                colorScheme="blue" 
                                                onClick={() => handleEditClick(tutor)}
                                            >
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
                                        <Button colorScheme="blue" mr={3} 
                                            onClick={() => handleActualizar(tutorActualizado.id, tutorActualizado)}>
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
    )

}

export default VerTutoresPage;