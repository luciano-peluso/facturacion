import { Box, Button, Card, CardBody, CardHeader, Divider, Flex, Heading, Input, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Header from "../componentes/header";
import axios from "axios";

const ConfiguracionPage = () => {
    const toast = useToast();
    const [configuracion, setConfiguracion] = useState({
        comision_consultorio: "",
        rango_precision: "",
    });

    const getConfiguraciones = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/configuracion/");
            setConfiguracion(response.data.data);
        } catch (error) {
            console.error("Error al traer las configuraciones: ", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfiguracion((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await axios.put("http://localhost:3000/api/configuracion/actualizar/", configuracion);
            toast({
                title: "Configuración actualizada",
                description: "La configuración se ha actualizado correctamente.",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
        } catch (error) {
            toast({
                title: "Error",
                description: "La configuración no se ha podido actualizar.",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
        }
    };

    useEffect(() => {
        getConfiguraciones();
    }, []);

    return (
        <>
            <Header />
            <Flex justify="center" mt={10}>
                <Card w="lg" p={5} borderRadius="lg" boxShadow="lg">
                    <CardHeader>
                        <Heading size="lg" textAlign="center">
                            Configuración
                        </Heading>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <Box mb={5}>
                            <Heading size="md">Comisión Consultorio</Heading>
                            <Text fontSize="sm" color="gray.600">
                                Porcentaje de comisión que se paga al consultorio sobre las facturas cobradas.
                            </Text>
                            <Input
                                mt={2}
                                type="number"
                                name="comision_consultorio"
                                value={configuracion.comision_consultorio}
                                onChange={handleChange}
                            />
                        </Box>
                        <Divider />
                        <Box mt={5}>
                            <Heading size="md">Rango de Precisión</Heading>
                            <Text fontSize="sm" color="gray.600">
                                Margen de tolerancia en la búsqueda de montos de facturas. Ejemplo: si es 10%, 
                                una factura de $40,000 buscará entre $36,000 y $44,000.
                            </Text>
                            <Input
                                mt={2}
                                type="number"
                                name="rango_precision"
                                value={configuracion.rango_precision}
                                onChange={handleChange}
                            />
                        </Box>
                        <Divider mt={5} />
                        <Button colorScheme="blue" width="full" mt={4} onClick={handleSave}>
                            Guardar cambios
                        </Button>
                    </CardBody>
                </Card>
            </Flex>
        </>
    );
};

export default ConfiguracionPage;
