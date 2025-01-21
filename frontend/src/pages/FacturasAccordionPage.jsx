import { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Heading,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
} from "@chakra-ui/react";

const FacturasPage = () => {
    const [facturas, setFacturas] = useState([]);
    const [facturasPorMes, setFacturasPorMes] = useState({});

    const traerFacturas = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/facturas");
            const facturasAgrupadas = agruparPorMes(response.data.data);
            setFacturasPorMes(facturasAgrupadas);
        } catch (error) {
            console.log("Error al traer las facturas: ", error);
        }
    };

    const agruparPorMes = (facturas) => {
        return facturas.reduce((acc, factura) => {
            const fecha = new Date(factura.fecha); // Convertimos la fecha a un objeto Date
            const mesAnio = `${fecha.toLocaleString("es-ES", { month: "long" })} ${fecha.getFullYear()}`; // Ejemplo: "enero 2024"
            if (!acc[mesAnio]) {
                acc[mesAnio] = [];
            }
            acc[mesAnio].push(factura);
            return acc;
        }, {});
    };

    useEffect(() => {
        traerFacturas();
    }, []);

    return (
        <Container maxW="container.xl" py={8}>
            <Heading as="h1" size="lg" mb={6}>
                Listado de Facturas por Mes
            </Heading>
            <Accordion allowMultiple>
                {Object.keys(facturasPorMes).map((mes) => (
                    <AccordionItem key={mes}>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                                {mes}
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            {facturasPorMes[mes].length > 0 ? (
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
                                            {facturasPorMes[mes].map((factura) => (
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
                            ) : (
                                <Text>No hay facturas para este mes.</Text>
                            )}
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </Container>
    );
};

export default FacturasPage;
