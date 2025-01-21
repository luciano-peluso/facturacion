import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Heading, HStack, Box, Button, Table, Thead, Tbody, Tr, Th, Td, InputGroup, InputLeftAddon, InputRightElement, Input } from "@chakra-ui/react";
import { RepeatIcon } from '@chakra-ui/icons';
import Header from "../componentes/header";


const FacturasPage = () => {
    const [facturas, setFacturas] = useState([]);
    const [monto, setMonto] = useState([]);

    const traerFacturas = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/facturas");
            setFacturas(response.data.data);
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
            factura.valor > montoMin && factura.valor < montoTope && factura.estado === false
        );

        setFacturas(nuevasFacturas);
    };

    const buscarPares = () => {
        // Calculamos el rango de tolerancia (±10%)
        const rangoMinimo = monto * 0.9;
        const rangoMaximo = monto * 1.1;
        
        // Filtramos solo facturas no cobradas
        const facturasPendientes = facturas.filter(f => !f.estado);
      
        // Agrupamos facturas por paciente
        const facturasPorPaciente = facturasPendientes.reduce((acc, factura) => {
          if (!acc[factura.paciente]) {
            acc[factura.paciente] = [];
          }
          acc[factura.paciente].push(factura);
          return acc;
        }, {});
      
        // Array para almacenar las facturas que cumplen con el criterio
        let facturasResultado = [];
      
        // Para cada paciente, buscamos si la suma de sus facturas está en el rango
        Object.entries(facturasPorPaciente).forEach(([paciente, facturasDelPaciente]) => {
          // Si el paciente tiene más de una factura, calculamos todas las combinaciones posibles de 2
          if (facturasDelPaciente.length >= 2) {
            for (let i = 0; i < facturasDelPaciente.length - 1; i++) {
              for (let j = i + 1; j < facturasDelPaciente.length; j++) {
                const suma = facturasDelPaciente[i].valor + facturasDelPaciente[j].valor;
                if (suma >= rangoMinimo && suma <= rangoMaximo) {
                  facturasResultado.push(facturasDelPaciente[i], facturasDelPaciente[j]);
                }
              }
            }
          }
        });
      
        // Ordenamos el resultado final por paciente
        facturasResultado.sort((a, b) => {
          if (a.paciente < b.paciente) return -1;
          if (a.paciente > b.paciente) return 1;
          return 0;
        });
        console.log(facturasResultado);
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
    
            // Si necesitas actualizar el listado en tu frontend después de marcarla como cobrada:
            traerFacturas(); // O actualiza el estado de facturas si lo tienes.
        } catch (error) {
            console.error("Error al eliminar la factura:", error);
        }
    }

    return (
        <>
        <Header />
        <Container maxW="container.xl" py={8}>

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
                            <Th>Nombre del Cliente</Th>
                            <Th>Obra Social</Th>
                            <Th>Numero de factura</Th>
                            <Th>Valor</Th>
                            <Th>Fecha</Th>
                            <Th>Cobrado</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {facturas.map((factura) => (
                            <Tr key={factura.id}>
                                <Td>{factura.paciente}</Td>
                                <Td>{factura.os}</Td>
                                <Td>{factura.num_factura}</Td>
                                <Td isNumeric>${factura.valor}</Td>
                                <Td>{factura.fecha}</Td>
                                <Td>{factura.estado ? "Cobrado" : "Pendiente"}</Td>
                                <Td>
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
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Container>
        </>
    );
};

export default FacturasPage;