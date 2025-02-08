import React, { useEffect, useState } from "react";
import Header from "../../componentes/header";
import { Box, Button, Container, FormLabel, Heading, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import axios from "axios";
import Sidebar from "../../componentes/Sidebar";

const VerPacientesPage = () => {
    const [pacienteActualizado, setPacienteActualizado] = useState({});
    const [pacientes, setPacientes] = useState([]);
    const [obrasSociales, setObrasSociales] = useState([]);
    const [tutores, setTutores] = useState([]);
    
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const traerPacientes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/pacientes');
            setPacientes(response.data.data);
        } catch (error) {
            console.log("Error al traer los pacientes:", error);
        }
    }

    const eliminar = async (pid) => {
        try {
            const response = await axios.delete('http://localhost:3000/api/pacientes/borrar/'+pid);
            traerPacientes();
            toast({
                title: "Éxito",
                description: "Se eliminó con éxito el paciente.",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
        } catch(error) {
            console.error("Error al eliminar el paciente: " + error);
            toast({
                title: "Error",
                description: "No se pudo eliminar el paciente.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPacienteActualizado((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (paciente) => {
        setPacienteActualizado(paciente);
        console.log(paciente);
        onOpen();  // Abrir la modal
    };

    const handleActualizar = async (pid, pacienteActualizado) => { 
        try {
            const response = await axios.put('http://localhost:3000/api/pacientes/actualizar/'+pid, pacienteActualizado);
            console.log("Paciente con ID: ", pid, " actualizado con exito: ", response.data);
            onClose();
            traerPacientes();
            toast({
                title: "Éxito",
                description: "El paciente ha sido actualizado exitosamente.",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
        } catch (error) {
            console.error("Error al editar el paciente: ", error);
            toast({
                title: "Error",
                description: "El paciente no se ha podido editar.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
        }
    }

    const traerObrasSociales = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/os');
          setObrasSociales(response.data.data);
        } catch (error) {
          console.error('Error al traer obras sociales:', error);
        }
    };

    const traerTutores = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/tutores');
          setTutores(response.data.data);
        } catch (error) {
          console.error('Error al traer tutores:', error);
        }
    };

    useEffect(() => {
        traerPacientes();
        traerObrasSociales();
        traerTutores();
    },[])
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
                                <Th textAlign={"center"} color={"white"}>Nombre</Th>
                                <Th textAlign={"center"} color={"white"}>DNI</Th>
                                <Th textAlign={"center"} color={"white"}>Obra Social</Th>
                                <Th textAlign={"center"} color={"white"}>Tutor</Th>
                                <Th textAlign={"center"} color={"white"}>Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {pacientes.length > 0 ? (
                            pacientes.map((paciente) => (
                                <Tr key={paciente.id}>
                                    <Td>{paciente.nombre}</Td>
                                    <Td>{paciente.dni}</Td>
                                    <Td>{paciente.obra_social.nombre}</Td>
                                    <Td>{paciente.tutor?.nombre || "Sin Tutor"}</Td>
                                    <Td maxW="140px">
                                        <HStack spacing={1} justifyContent={"center"}>
                                            <Button size="sm" title="Editar" onClick={() => handleEditClick(paciente)}
                                            _hover={{ bg:"#008E6D" }} bg={"green.100"}>✏️</Button>
                                            <Button size="sm" title="Borrar" onClick={() => eliminar(paciente.id)}
                                            _hover={{ bg:"#008E6D" }} bg={"green.100"}>🗑️</Button>
                                        </HStack>
                                    </Td>
                                </Tr>
                            )) ) : 
                            <Tr>
                              <Td colSpan="5" textAlign="center">No hay pacientes cargados en el sistema</Td>
                            </Tr> }
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
                                <FormLabel>Nombre
                                <Input 
                                    placeholder="Nombre"
                                    name="nombre"
                                    value={pacienteActualizado.nombre}
                                    onChange={handleChange}
                                    minW={"200px"}/></FormLabel>

                                <FormLabel>Número de DNI
                                <Input 
                                    placeholder="Numero de DNI"
                                    name="dni"
                                    value={pacienteActualizado.dni}
                                    onChange={handleChange}
                                    minW={"200px"}/></FormLabel>
                                    
                                    <FormLabel>Obra Social</FormLabel>
                                    <Select
                                    name="obra_social_id"
                                    value={pacienteActualizado.obra_social_id}
                                    onChange={handleChange}
                                    >
                                    {obrasSociales.map((os) => (
                                        <option key={os.id} value={os.id}>
                                        {os.nombre}
                                        </option>
                                    ))}
                                    </Select>
                                    
                                    <FormLabel>Tutor</FormLabel>
                                    <Select
                                    name="tutor_id"
                                    value={pacienteActualizado.tutor_id || ""} // Mostrar "" si es null
                                    onChange={(e) =>
                                        setPacienteActualizado((prev) => ({
                                            ...prev,
                                            tutor_id: e.target.value === "" ? null : parseInt(e.target.value, 10),
                                        }))
                                    }
                                >
                                    <option value="null">Sin Tutor</option>
                                    {tutores.map((tutor) => (
                                        <option key={tutor.id} value={tutor.id}>
                                        {tutor.nombre}
                                        </option>
                                    ))}
                                    </Select>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} 
                                onClick={() => handleActualizar(pacienteActualizado.id, pacienteActualizado)}>
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

export default VerPacientesPage