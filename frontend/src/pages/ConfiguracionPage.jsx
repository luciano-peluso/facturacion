import { Box, Button, Card, CardBody, CardHeader, Divider, Flex, Heading, Input, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Header from "../componentes/header";
import axios from "axios";
import Sidebar from "../componentes/sidebar";

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
        <Box className="container" display="flex" w="100%" minW="1400px">
            <Sidebar />

            <Box className="dashboard" overflow="scroll" flex="1" p={4}>
                <Header mensaje={""} />
                <Box w={"100%"} p={8} paddingTop={0} borderRadius="lg">
                    <Heading size="lg" textAlign="left" pb={3}>
                        Configuración
                    </Heading>
                    <Divider />
                    <Box pt={4} mb={5}>
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
                </Box>
            </Box>
        </Box>
    );
};

export default ConfiguracionPage;
