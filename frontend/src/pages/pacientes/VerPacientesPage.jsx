import React, { useEffect, useState } from "react";
import Header from "../../componentes/header";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Container, FormLabel, Heading, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, Tag, TagCloseButton, TagLabel, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import axios from "axios";
import Sidebar from "../../componentes/Sidebar";
import { useRef } from "react";

const VerPacientesPage = () => {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [pacienteAEliminar, setPacienteAEliminar] = useState(null);
    const cancelRef = useRef();

    const [pacienteActualizado, setPacienteActualizado] = useState({});
    const [pacientes, setPacientes] = useState([]);
    const [obrasSociales, setObrasSociales] = useState([]);
    const [obrasSocialesPacientes, setObrasSocialesPacientes] = useState([]);
    const [obrasSocialesUnPaciente, setObrasSocialesUnPaciente] = useState([]);
    const [obrasSocialesEditadas, setObrasSocialesEditadas] = useState([]);
    
    const [tutores, setTutores] = useState([]);
    
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [busqueda, setBusqueda] = useState("");

    const pacientesFiltrados = pacientes.filter((paciente) =>
        paciente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        paciente.dni.toString().includes(busqueda) ||
        paciente.obra_social.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (paciente.tutor?.nombre || "").toLowerCase().includes(busqueda.toLowerCase())
    );

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
        traerObrasSocialesUnPaciente(paciente.id);
        onOpen();  // Abrir la modal
    };

    const handleActualizar = async (pid, pacienteActualizado) => { 
        try {
            const response = await axios.put('http://localhost:3000/api/pacientes/actualizar/'+pid, pacienteActualizado);
            console.log("Paciente con ID: ", pid, " actualizado con exito: ", response.data);
            // Obtener IDs de obras sociales ya existentes
            const idsExistentes = obrasSocialesUnPaciente.map(os => os.ObraSocial.id);
            
            // Filtrar solo las nuevas obras sociales
            const nuevasObrasSociales = obrasSocialesEditadas.filter(os => !idsExistentes.includes(os.id));

            // Enviar POST por cada obra social nueva
            for (const obraSocial of nuevasObrasSociales) {
                await axios.post("http://localhost:3000/api/pacienteobrasocial/", {
                    paciente_id: pid,
                    obra_social_id: obraSocial.id,
                });
            }

            // Cerrar modal si todo fue bien
            onClose();
            traerPacientes();
            traerObrasSocialesPacientes();
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

    const traerObrasSocialesPacientes = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/pacienteobrasocial/")
            setObrasSocialesPacientes(response.data.data);
        } catch (error) {
            console.error("Error al traer las obras sociales del paciente", error);
        }
    }

    const traerObrasSocialesUnPaciente = async (id) => {
        try {
            const response = await axios.get("http://localhost:3000/api/pacienteobrasocial/"+id)
            const relaciones = response.data.data;

            setObrasSocialesUnPaciente(relaciones);
            setObrasSocialesEditadas(relaciones.map(r => r.ObraSocial));
        } catch (error) {
            console.error("Error al traer las obras sociales del paciente", error);
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
        traerObrasSocialesPacientes();
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
            <Input 
                placeholder="🔍 Buscar por nombre, DNI..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            <Box className="latest-invoices" w="100%" overflowX="auto" marginTop={"15px"}>
                <Heading size="md" mb={2}>Pacientes cargados</Heading>
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
                            {pacientesFiltrados.length > 0 ? (
                                pacientesFiltrados.map((paciente) => (
                                    <Tr key={paciente.id}>
                                        <Td>{paciente.nombre}</Td>
                                        <Td>{paciente.dni}</Td>
                                        <Td>{obrasSocialesPacientes.filter(unaObraSocial => unaObraSocial.paciente_id === paciente.id)
                                                .map(unaObraSocial => unaObraSocial.ObraSocial.nombre)
                                                .join(", ") || "Sin Obra Social"}</Td> 
                                        <Td>{paciente.tutor?.nombre || "Sin Tutor"}</Td>
                                        <Td maxW="140px">
                                            <HStack spacing={1} justifyContent={"center"}>
                                                <Button size="sm" title="Editar" onClick={() => handleEditClick(paciente)}
                                                _hover={{ bg:"#008E6D" }} bg={"green.100"}>✏️</Button>
                                                <Button size="sm" title="Borrar" _hover={{ bg: "#008E6D" }} bg={"green.100"} onClick={() => { 
                                                    setPacienteAEliminar(paciente);
                                                    setIsAlertOpen(true);
                                                }} >🗑️</Button>
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))
                            ) : 
                            <Tr>
                                <Td colSpan="5" textAlign="center">No hay pacientes que coincidan con la búsqueda</Td>
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
                                    
                                    <FormLabel>Obras Sociales</FormLabel>
                                    {obrasSocialesEditadas.map((obraSocial, index) => (
                                        <Tag key={index} size="lg" variant="solid" colorScheme="green" m={1}>
                                            <TagLabel>{obraSocial.nombre}</TagLabel>
                                            <TagCloseButton
                                                onClick={async () => {
                                                    const obraSocial = obrasSocialesEditadas[index];
                                                    try {
                                                        await axios.delete("http://localhost:3000/api/pacienteobrasocial/borrar/", {
                                                             data: {
                                                                paciente_id: pacienteActualizado.id,
                                                                obra_social_id: obraSocial.id,
                                                            },
                                                        });
                                                        setObrasSocialesEditadas(prev => prev.filter((_, i) => i !== index));
                                                    } catch (error) {
                                                        console.error("Error al eliminar obra social del paciente", error);
                                                    }
                                                }}
                                            />
                                        </Tag>
                                    ))}

                                    {/* SELECT para agregar nuevas obras sociales */}
                                    <Select
                                        placeholder="Seleccionar obra social"
                                        onChange={(e) => {
                                            const idSeleccionado = parseInt(e.target.value);
                                            const yaExiste = obrasSocialesEditadas.some(os => os.id === idSeleccionado);
                                            if (!yaExiste) {
                                                const seleccionada = obrasSociales.find(os => os.id === idSeleccionado);
                                                if (seleccionada) {
                                                    setObrasSocialesEditadas(prev => [...prev, seleccionada]);
                                                }
                                            }
                                        }}
                                    >
                                        {obrasSociales.map(os => (
                                            <option key={os.id} value={os.id}>{os.nombre}</option>
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
            <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
        >
        <AlertDialogOverlay>
        <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Confirmar eliminación
            </AlertDialogHeader>

            <AlertDialogBody>
            ¿Estás seguro que querés eliminar al paciente{" "}
            <strong>{pacienteAEliminar?.nombre}</strong>? Esta acción no se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancelar
            </Button>
            <Button
                colorScheme="red"
                onClick={() => {
                eliminar(pacienteAEliminar.id);
                setIsAlertOpen(false);
                }}
                ml={3}
            >
                Eliminar
            </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialogOverlay>
        </AlertDialog>
        </Box>
        )
}

export default VerPacientesPage