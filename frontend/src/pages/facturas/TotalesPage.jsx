import { Box, Button, Card, CardBody, CardHeader, Container, Divider, Flex, FormControl, FormLabel, Heading, Select, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Header from "../../componentes/header";
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";


const TotalesPage = () => {
    const [mesSeleccionado, setMesSeleccionado] = useState("");
    const [anioSeleccionado, setAnioSeleccionado] = useState("");
    const [facturas, setFacturas] = useState([]); // Para guardar la respuesta de la API
    const [porcentajeComision, setPorcentajeComision] = useState([]);
    const [totales, setTotales] = useState({
        total_bruto: 0,
        total_neto: 0,
        total_comision: 0
    });
    
    const getFacturasPorMes = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/facturas/mes/${mesSeleccionado}/${anioSeleccionado}`);
            setFacturas(response.data.data);
            return response.data.data; // Retornamos el array de facturas
        } catch (error) {
            console.error("Error al obtener facturas:", error);
            return []; // Retornamos un array vacío en caso de error
        }
    };

    const getPorcentajeComision = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/configuracion');
            setPorcentajeComision(response.data.data.comision_consultorio);
        } catch (error) {
            console.error("No se pudo traer el porcentaje de comision del consultorio... Dejandolo default...");
            setPorcentajeComision(10);
        }
    }

    const calcularFacturasPorMes = async () => {
        try {
            const nuevasFacturas = await getFacturasPorMes(); // Esperamos el resultado
    
            if (!nuevasFacturas || nuevasFacturas.length === 0) {
                console.warn("No hay facturas para calcular.");
                return;
            }
    
            // Sumar todos los montos
            let total = nuevasFacturas.reduce((acc, factura) => acc + parseFloat(factura.monto), 0);
    
            // Filtrar solo las facturas del consultorio y calcular la comisión
            let totalConsultorio = nuevasFacturas
                .filter(factura => factura.es_consultorio) // Solo consultorio
                .reduce((acc, factura) => acc + parseFloat(factura.monto), 0);
    
            const comision = totalConsultorio * (porcentajeComision / 100);
    
            setTotales({
                total_bruto: total,
                total_neto: total - comision,
                total_comision: comision
            });
        } catch (error) {
            console.error("Error al calcular facturas:", error);
        }
    };

    useEffect(() => {
        getPorcentajeComision();
    }, []);

    return (<>
        <Header />
        <Container mt={"10"}minW={"container.xl"}>
            <Card>
                <CardHeader>
                    <Heading textAlign={"center"}>Totales facturados por mes</Heading>
                </CardHeader>
                <CardBody>
                    <Flex gap={4} alignItems={"end"}>
                        <FormControl>
                            <FormLabel>Seleccione un mes:</FormLabel>
                            <Select value={mesSeleccionado} onChange={(e) => setMesSeleccionado(e.target.value)}>
                                <option value="">Seleccionar</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString("es-ES", { month: "long" })}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Seleccione un año:</FormLabel>
                            <Select value={anioSeleccionado} onChange={(e) => setAnioSeleccionado(e.target.value)}>
                                <option value="">Seleccionar</option>
                                {[...Array(10)].map((_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <Button colorScheme="blue" onClick={() => calcularFacturasPorMes()} minW={"70"}>
                            Buscar
                        </Button>
                    </Flex>
                    <Divider mt={5} mb={5} />
                    
                    {facturas.length > 0 ? (
                        <Box
                         mt={4} p={4} border="1px solid" borderColor="gray.300" borderRadius="md">
                            <Heading size="md" mb={4} textAlign="center">Facturas encontradas</Heading>
                            
                            {/* Tabla de facturas */}
                            <Table variant="striped" colorScheme="teal" size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>#</Th>
                                        <Th>Número Factura</Th>
                                        <Th>Monto</Th>
                                        <Th>Fecha Facturada</Th>
                                        <Th>Fecha Cobro</Th>
                                        <Th>Tipo</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {facturas.map((factura, index) => (
                                        <Tr key={factura.id}>
                                            <Td>{index + 1}</Td>
                                            <Td>{factura.numero_factura}</Td>
                                            <Td>${Number(factura.monto).toFixed(2)}</Td>
                                            <Td>{factura.fecha_facturada ? format(new Date(factura.fecha_facturada), "MMMM yyyy", { locale: es })
                                                                                .replace(/^\w/, (c) => c.toUpperCase()) : "Fecha no disponible"}</Td>
                                            <Td>{factura.fecha_cobro}</Td>
                                            <Td>{factura.es_consultorio ? "Consultorio" : "Particular"}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>

                            <Divider mt={3} mb={3} />

                            {/* Diseño tipo ticket */}
                            <Box mt={4} p={3} bg="gray.100" border="2px dashed gray"
                                borderRadius="md" textAlign="center">
                                <Text fontSize="lg" fontWeight="bold" color="gray.700">Total Facturado</Text>
                                <Flex justify="space-between" fontSize="md" fontWeight="medium" mt={2}>
                                    <Text color="gray.600">Total Bruto:</Text>
                                    <Text color="blue.600">${totales.total_bruto.toFixed(2)}</Text>
                                </Flex>
                                <Flex justify="space-between" fontSize="md" fontWeight="medium">
                                    <Text color="gray.600">Total Comisión:</Text>
                                    <Text color="red.500">${totales.total_comision.toFixed(2)}</Text>
                                </Flex>
                                <Flex justify="space-between" fontSize="md" fontWeight="medium">
                                    <Text color="gray.600">Total Neto:</Text>
                                    <Text color="green.600">${totales.total_neto.toFixed(2)}</Text>
                                </Flex>
                            </Box>
                        </Box>
                    ) : (
                        <Text mt={4} color="red.500" textAlign="center">No hay facturas para este período.</Text>
                    )}
                </CardBody>
            </Card>
        </Container>
    </>)
}

export default TotalesPage;