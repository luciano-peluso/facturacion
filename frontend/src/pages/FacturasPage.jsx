import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Heading, HStack, Box, Button, Table, Thead, Tbody, Tr, Th, Td, InputGroup, InputLeftAddon, InputRightElement, Input } from "@chakra-ui/react";
import { RepeatIcon } from '@chakra-ui/icons';


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
            factura.valor > montoMin && factura.valor < montoTope
        );

        setFacturas(nuevasFacturas);
    };

    const resultadosPosibles = () => {
        const facturasNoCobradas = facturas.filter(factura => 
            factura.estado === false
        );

        const contadorPacientes = facturasNoCobradas.reduce((acc, factura) => {
            acc[factura.paciente] = (acc[factura.paciente] || 0) + 1;
            return acc;
        }, {});

        console.log(contadorPacientes);
    
        // Paso 2: Filtrar las facturas cuyos pacientes aparecen más de una vez
        const facturasFiltradas = facturasNoCobradas.filter(factura => 
            contadorPacientes[factura.paciente] > 1
        );
    
        return facturasFiltradas;
    };

    const handleResultadosPosibles = () => {
        
        const facturasAIterar = resultadosPosibles();

        // Agrupamos y sumamos los valores por paciente
        const facturasAgrupadas = facturasAIterar.reduce((acc, factura) => {
            // Si el paciente ya existe en el acumulador, sumamos el valor de su factura
            if (acc[factura.paciente]) {
                acc[factura.paciente] += factura.valor;
            } else {
                // Si no existe, inicializamos con el valor de su factura
                acc[factura.paciente] = factura.valor;
            }
            return acc;
        }, {});
    
        console.log("Sumatoria por paciente:", facturasAgrupadas);
    }


    return (
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
                onClick={handleResultadosPosibles}
            >
                    PRUEBA
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
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Container>
    );
};

export default FacturasPage;