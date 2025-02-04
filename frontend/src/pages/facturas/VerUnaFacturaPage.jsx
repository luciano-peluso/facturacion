import React, { useEffect, useState } from "react";
import Header from "../../componentes/header";
import { Form, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, Divider, Flex, FormControl, FormLabel, GridItem, Heading, Spinner, Text, Textarea } from "@chakra-ui/react";
import { Grid } from "lucide-react";

const VerUnaFacturaPage = () => {
    const { id } = useParams();
    const [factura, setFactura] = useState({    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const traerFactura = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/facturas/'+id);
                setFactura(response.data.data)
            } catch (error) {
                console.error("Error al obtener la factura:", error);
                setError("No se pudo cargar la factura.");
            } finally {
                setLoading(false);
            }
        };
        traerFactura();
    }, [id]);

    if (loading) return <Spinner />;
    if (error) return <Text color="red.500">{error}</Text>;

    // Cuerpo del email
    const cuerpoEmail = `Estimados,

Espero que se encuentren bien.

Me dirijo a ustedes para recordarles sobre el pago pendiente de la factura ${factura.numero_factura}, emitida el ${factura.fecha_emision} por un monto total de $${factura.monto}. A la fecha, la misma sigue sin ser abonada.

Les agradecería si pudieran brindarme una actualización sobre el estado de este pago y la fecha estimada de cancelación. Adjunto nuevamente la factura para su referencia.

Quedo atento a su pronta respuesta y agradezco de antemano su atención.

Saludos cordiales,
[Tu nombre]
[Tu número de contacto]
[Tu dirección de correo electrónico]
    `;

    return (<>
        <Header />
        <Box p={6}>
            <Heading as="h2" mb={4}>
                Factura #{factura.numero_factura}
            </Heading>

            {/* Detalles de la factura */}
            <Flex direction="row" gap={4} mb={6}>
                <Box>
                    <Text fontWeight="bold" color="gray.700">Paciente:</Text>
                    <Text>{factura.paciente.nombre}</Text>
                </Box>

                <Box>
                    <Text fontWeight="bold" color="gray.700">Obra social:</Text>
                    <Text>{factura.paciente.obra_social.nombre}</Text>
                </Box>

                <Box>
                    <Text fontWeight="bold" color="gray.700">Fecha de emisión:</Text>
                    <Text>{new Date(factura.fecha_facturada).toLocaleDateString("es-AR")}</Text>
                </Box>

                <Box>
                    <Text fontWeight="bold" color="gray.700">Monto:</Text>
                    <Text>${factura.monto}</Text>
                </Box>

                <Box>
                    <Text fontWeight="bold" color="gray.700">Tipo:</Text>
                    <Text>{factura.es_consultorio ? "Consultorio" : "Particular"}</Text>
                </Box>

                <Box>
                    <Text fontWeight="bold" color="gray.700">Estado:</Text>
                    <Text>{factura.estado ? "Pagada" : "Pendiente"}</Text>
                </Box>

                <Box>
                    <Text fontWeight="bold" color="gray.700">Fecha de cobro:</Text>
                    <Text>{factura.fecha_cobro ? new Date(factura.fecha_cobro).toLocaleDateString("es-AR") : "No pagada"}</Text>
                </Box>
            </Flex>
            <Divider mb={6} />

            <Heading as="h3" size="md" mb={4}>
                Enviar recordatorio de pago
            </Heading>
            
            {factura.paciente.obra_social.mail ? 
            <FormControl mb={4}>
                <FormLabel htmlFor="paraEmail" fontWeight="bold" fontSize="lg" color="gray.700">
                    Para:
                </FormLabel>
                <Textarea
                    id="paraEmail"
                    readOnly
                    value={`${factura.paciente.obra_social.mail}`}
                    maxH="40px"
                    bg="gray.100"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                    fontSize="md"
                />
            </FormControl> : ""}

            <FormControl mb={4}>
                <FormLabel htmlFor="asuntoEmail" fontWeight="bold" fontSize="lg" color="gray.700">
                    Asunto:
                </FormLabel>
                <Textarea
                    id="asuntoEmail"
                    readOnly
                    value={`Solicitud de pago pendiente – Factura ${factura.numero_factura}`}
                    maxH="40px"
                    bg="gray.100"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                    fontSize="md"
                />
            </FormControl>

            <FormControl mb={6}>
                <FormLabel htmlFor="cuerpoEmail" fontWeight="bold" fontSize="lg" color="gray.700">
                    Cuerpo del mensaje:
                </FormLabel>
                <Textarea
                    id="cuerpoEmail"
                    value={cuerpoEmail}
                    readOnly
                    height="300px"
                    placeholder="El mensaje se genera automáticamente con los datos de la factura."
                    bg="gray.100"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                    fontSize="md"
                    resize="none"
                />
            </FormControl>

            <Button colorScheme="blue" onClick={() => alert("Enviando correo...")}>
                Enviar recordatorio
            </Button>
        </Box>
        </>
    );
}

export default VerUnaFacturaPage;