import { Box, Button, Card, CardBody, CardHeader, Divider, Flex, Heading, Input, Select, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Header from "../componentes/header";
import axios from "axios";
import Sidebar from "../componentes/Sidebar";

const ConfiguracionPage = () => {
    const toast = useToast();
    const [condicionesIva, setCondicionesIva] = useState([]);
    const [isLoading, setIsLoading] = useState(false); 
    const [configuracion, setConfiguracion] = useState({
        comision_consultorio: "",
        rango_precision: "",
        razon_social: "",
        domicilio: "",
        ingresos_brutos: "",
        inicio_actividades: "",
        condicion_iva_id: 0,
    });

    const [instanciaAfip, setInstanciaAfip] = useState({
        "cuit": "",
        "username": "",
        "password": "",
    })

    const [estaConfigurado, setEstaConfigurado] = useState(false);
    const getVerificacionInstancia = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/afip/verificar");
            setEstaConfigurado(response.data.success);
        } catch (error) {
            console.error("Error al traer la verificacion de la instancia:", error);
        }
    }

    const emitirCertificados = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:3000/api/afip/crear/instancia", instanciaAfip);
            console.log(response)
            if(response){
                toast({
                    title: "Instancia creada con éxito",
                    status: "success",
                    description: "Ya está listo para emitir comprobantes electrónicos. "+response.data.message,
                    duration: 5000,
                    isClosable: true
                });
            }
            setEstaConfigurado(true);
        } catch (error) {
            console.log("Error al emitir los certificados:",error);
            const message = error.response.data.message;
            toast({
                title: "Error",
                status: "error",
                description: message,
                duration: 5000,
                isClosable: true
            });
        } finally {
            setIsLoading(false);
        }
    }

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

    const handleChangeAfip = (e) => {
        const {name, value} = e.target;
        setInstanciaAfip((prev) => ({ ...prev, [name]: value}))
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
        getVerificacionInstancia();
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
                            min={0}
                            max={100}
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
                            min={0}
                            max={100}
                            value={configuracion.rango_precision}
                            onChange={handleChange}
                        />
                    </Box>
                   
                    <Heading size={"lg"} mt={4}>Configuración ARCA (AFIP)</Heading>
                    <Divider mt={5} mb={3}/>
                    <Box mt={5}>
                        <Heading size={"md"}>CUIT</Heading>
                        <Text fontSize={"sm"} color={"gray.600"}>
                            El CUIT asociado a la cuenta de ARCA para la que se crearán los certificados de los certificados de emision de comprobantes electrónicos.
                        </Text>
                        <Input 
                            isDisabled={estaConfigurado}
                            mt={2}
                            type="text"
                            name="cuit"
                            value={instanciaAfip.cuit}
                            onChange={handleChangeAfip}/>
                    </Box>
                    <Box mt={5}>
                        <Heading size={"md"}>Nombre de usuario</Heading>
                        <Text fontSize={"sm"} color={"gray.600"}>
                            Te pedimos que ingreses tus credenciales de inicio en ARCA para la emisión de los certificados. Tus datos no serán guardados, solamente serán usados una única vez para la emisión de estos certificados necesarios para la emisión de comprobantes electrónicos.
                            (Generalmente el nombre de usuario suele ser el mismo que el CUIT)
                        </Text>
                        <Input 
                            isDisabled={estaConfigurado}
                            mt={2}
                            type="text"
                            name="username"
                            value={instanciaAfip.username}
                            onChange={handleChangeAfip}/>
                    </Box>
                    <Box mt={5}>
                        <Heading size={"md"}>Contraseña</Heading>
                        <Input 
                            isDisabled={estaConfigurado}
                            mt={2}
                            type="password"
                            name="password"
                            value={instanciaAfip.password}
                            onChange={handleChangeAfip}/>
                    </Box>
                    <Button isDisabled={isLoading || estaConfigurado}  isLoading={isLoading} loadingText="Emisión en progreso..." colorScheme="green" width="full" mt={4} onClick={emitirCertificados}>
                        Emitir certificados
                    </Button>
                    <Divider mt={5} mb={3}/>
                    <Heading size={"lg"} mt={4}>Configuración Facturas</Heading>
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
                            El numero de 8 dígitos pertenenciente a ingresos brutos.
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
                            Selecciona la fecha en la que comenzaron las actividades de tu negocio.
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
                        Selecciona la condición de IVA que corresponde a tu negocio.
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
