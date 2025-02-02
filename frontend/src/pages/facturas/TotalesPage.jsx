import { Box, Button, Card, CardBody, CardHeader, Container, Divider, Flex, FormControl, FormLabel, Heading, Select, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Header from "../../componentes/header";
import axios from "axios";


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
    
            let total = nuevasFacturas.reduce((acc, factura) => acc + parseFloat(factura.monto), 0);
            const comision = total * (porcentajeComision / 100);
    
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
                    <Box mt={4}>
                        <Heading size="md" mb={2}>Facturas encontradas:</Heading>
                        {facturas.map((factura) => (
                            <Text key={factura.id}>
                                Factura #{factura.numero_factura} - ${factura.monto} - {factura.fecha_cobro} - {factura.es_consultorio ? "Consultorio" : "Particular"}
                            </Text>
                        ))}
                        <Divider mt={3} mb={3}/>
                        <Text>
                            <strong>Total Bruto:</strong> {totales.total_bruto} - <strong>Total Neto:</strong> {totales.total_neto} - <strong>Total Comisión:</strong> {totales.total_comision}
                        </Text>
                    </Box>
                    ) : (
                        <Text mt={4}>No hay facturas para este período.</Text>
                    )}
                </CardBody>
            </Card>
        </Container>
    </>)
}

export default TotalesPage;