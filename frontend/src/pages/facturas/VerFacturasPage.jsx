import { useState, useEffect } from "react";
import axios from "axios";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Container, 
    Heading, HStack, Box, Button, Table, Thead, Tbody, Tr, Th, Td, InputGroup, InputLeftAddon, InputLeftElement, Input, VStack, Modal, 
    useDisclosure, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, NumberInput, NumberInputField, ModalFooter, useToast, Select, FormLabel } from "@chakra-ui/react";
import { RepeatIcon } from '@chakra-ui/icons';
import Header from "../../componentes/header";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRef } from "react";

const FacturasPage = () => {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [facturaAEliminar, setFacturaAEliminar] = useState(null);
    const cancelRef = useRef();
    const [facturas, setFacturas] = useState([]);
    const [monto, setMonto] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [rangoPrecision, setRangoPrecision] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();

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
      
    const toast = useToast();

    const formattedValue = facturaActualizada.monto ? facturaActualizada.monto.toString().replace('.', ',') : '';


    const obtenerRangoPrecision = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/configuracion');
            setRangoPrecision(response.data.data.rango_precision);
        } catch (error) {
            console.error("Error al traer el rango precision. Dejandolo en default...");
            setRangoPrecision(10);
        }
    }
    
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
        obtenerRangoPrecision();
        traerPacientes();
    }, []);

    const handleRefresh = () => {
        setMonto("");
        traerFacturas();
    };

   const handleClick = () => {
        console.log("Monto buscado:", monto);
        
        const montoTope = monto * (1 + parseFloat(rangoPrecision) / 100); // Sumar el porcentaje de rango
        const montoMin = monto * (1 - parseFloat(rangoPrecision) / 100);

        
        console.log("Buscamos un monto entre:", montoTope, " y ", montoMin);

        const nuevasFacturas = facturas.filter(factura => 
            factura.monto > montoMin && factura.monto < montoTope && factura.estado === false
        );

        setFacturas(nuevasFacturas);
    };

    const buscarPares = () => {
        const rangoMinimo = monto * (1 - rangoPrecision / 100);
        const rangoMaximo = monto * (1 + rangoPrecision / 100);
        
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
                            <Th>Cuidador o encargado</Th>
                            <Th>Numero de factura</Th>
                            <Th>Valor</Th>
                            <Th>Periodo facturado</Th>
                            <Th>Fecha de emision</Th>
                            <Th>Cobrado</Th>
                            <Th textAlign="center">Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {facturas.length > 0 ? (
                        facturas.map((factura) => {
                            const { numero_factura, monto, fecha_facturada, fecha_emision, estado, id } = factura;
                            const paciente = factura.paciente_obra_social.paciente;
                            const obraSocial = factura.paciente_obra_social?.obra_social;
                            const tutor = paciente?.tutor;
                            
                            return (
                                <Tr key={id}>
                                    <Td>{paciente ? paciente.nombre : "Eliminado"}</Td>
                                    <Td>{obraSocial ? `${obraSocial.nombre} (CUIT: ${obraSocial.cuit})` : "Sin Obra Social"}</Td>
                                    <Td>{tutor ? `${tutor.nombre} (DNI: ${tutor.dni})` : "Sin cuidador o encargado"}</Td>
                                    <Td>{numero_factura}</Td>
                                    <Td>${monto}</Td>
                                    <Td>
                                        {fecha_facturada
                                            ? format(new Date(fecha_facturada + "T12:00:00Z"), "MMMM yyyy", { locale: es })
                                                .replace(/^\w/, (c) => c.toUpperCase())
                                            : "Fecha no disponible"}
                                    </Td>
                                    <Td>
                                        {fecha_emision
                                            ? format(new Date(fecha_emision), "dd/MM/yyyy")
                                            : "Fecha no disponible"}
                                    </Td>
                                    <Td>{estado ? "Cobrado" : "Pendiente"}</Td>
                                    <Td>
                                        <VStack>
                                            <HStack spacing={2} justifyContent={"center"}>
                                                {!estado && (
                                                    <Button size="md" colorScheme="green" onClick={() => marcarCobrada(id)}>
                                                        Cobrar
                                                    </Button>
                                                )}
                                                <Button size="md" colorScheme="red" onClick={() => eliminar(id)}>
                                                    X
                                                </Button>
                                            </HStack>
                                            <HStack spacing={2} justifyContent={"center"}>
                                                <Button colorScheme="blue" onClick={() => handleEditClick(factura)}>
                                                    Editar
                                                </Button>
                                            </HStack>
                                        </VStack>
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
                        colorScheme="blue"
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
        </Container>
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
                    ¿Estás seguro que querés eliminar la factura numero:{" "}
                    <strong>{facturaAEliminar?.numero_factura}</strong>? Esta acción no se puede deshacer.
                </AlertDialogBody>

                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                    Cancelar
                    </Button>
                    <Button
                    colorScheme="red"
                    onClick={() => {
                        eliminar(facturaAEliminar.id);
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
        </>
    );
};

export default FacturasPage;