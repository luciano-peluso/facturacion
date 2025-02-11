import { Box, Button, Card, CardBody, CardHeader, Divider, Flex, Heading, Input, Select, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Header from "../componentes/header";
import axios from "axios";
import Sidebar from "../componentes/sidebar";

const ConfiguracionPage = () => {
    const toast = useToast();
    const [condicionesIva, setCondicionesIva] = useState([]);
    const [configuracion, setConfiguracion] = useState({
        comision_consultorio: "",
        rango_precision: "",
        razon_social: "",
        domicilio: "",
        ingresos_brutos: "",
        inicio_actividades: "",
        condicion_iva_id: 0,
    });

    const getConfiguraciones = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/configuracion/");
            setConfiguracion(response.data.data);
        } catch (error) {
            console.error("Error al traer las configuraciones: ", error);
        }
    };

    const getCondicionesIva = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/condicionIva');
            setCondicionesIva(response.data.data);
        } catch (error) {
            console.error("Error al traer las condiciones de iva:",error);
        }
    }

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
        getCondicionesIva();
    }, []);

    return (
        <Box className="container" display="flex" w="100%" minW="1400px">
            <Sidebar />

            <Box className="dashboard" overflow="scroll" flex="1" p={4}>
                <Header mensaje={""} />
                <Box w={"100%"} p={8} paddingTop={0} borderRadius="lg">
                    
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
                    <Heading size={"lg"} mt={4}>Configuración AFIP</Heading>
                    <Divider mt={5} mb={3}/>
                    <Box mt={5}>
                        <Heading size="md">Razon social</Heading>
                        <Text fontSize="sm" color="gray.600">
                            La razon social que se mostrará al emitir una factura.
                        </Text>
                        <Input
                            mt={2}
                            type="text"
                            name="razon_social"
                            value={configuracion.razon_social}
                            onChange={handleChange}
                        />
                    </Box>
                    <Box mt={5}>
                        <Heading size="md">Domicilio</Heading>
                        <Text fontSize="sm" color="gray.600">
                            El domicilio fiscal que se mostrará al emitir una factura.
                        </Text>
                        <Input
                            mt={2}
                            type="text"
                            name="domicilio"
                            value={configuracion.domicilio}
                            onChange={handleChange}
                        />
                    </Box>

                    <Box mt={5}>
                        <Heading size="md">Ingresos brutos</Heading>
                        <Text fontSize="sm" color="gray.600">
                            El numero pertenenciente a ingresos brutos.
                        </Text>
                        <Input
                            mt={2}
                            type="text"
                            name="ingresos_brutos"
                            value={configuracion.ingresos_brutos}
                            onChange={handleChange}
                        />
                    </Box>

                    <Box mt={5}>
                        <Heading size="md">Comienzo de actividades</Heading>
                        <Text fontSize="sm" color="gray.600">
                            La razon social que se mostrará al emitir una factura.
                        </Text>
                        <Input
                            mt={2}
                            type="date"
                            name="inicio_actividades"
                            value={configuracion.inicio_actividades}
                            onChange={handleChange}
                        />
                    </Box>

                    <Box mt={5}>
                        <Heading size="md">Condicion IVA</Heading>
                        <Text fontSize="sm" color="gray.600">
                            La razon social que se mostrará al emitir una factura.
                        </Text>
                        <Select
                            mt={2}
                            name="condicion_iva_id"
                            value={configuracion.condicion_iva_id}
                            onChange={handleChange}
                        >
                            {condicionesIva.map(condicionIva => (
                                <option key={condicionIva.id} value={condicionIva.id}>
                                    {condicionIva.descripcion}
                                </option>
                            ))}
                        </Select>
                    </Box>
                    <Button colorScheme="green" width="full" mt={4} onClick={handleSave}>
                        Guardar cambios
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ConfiguracionPage;
