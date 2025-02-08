import React, { useEffect, useState } from "react";
import Header from "../../componentes/header";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Text,
  Textarea,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import Sidebar from "../../componentes/Sidebar";

const VerUnaFacturaPage = () => {
  const { id } = useParams();
  const [factura, setFactura] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const traerFactura = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/facturas/${id}`);
        setFactura(response.data.data);
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

  // Colores para el fondo y la sombra
  const bgColor = useColorModeValue("white", "gray.700");
  const shadow = useColorModeValue("md", "dark-lg");

  return (
    <Box className="container" display="flex" w="100%">
      <Sidebar />

      {/* Main Dashboard */}
      <Box className="dashboard" overflow="hidden" flex="1" p={4}>
        <Header mensaje="" />

        <Box
          maxW="1200px"
          p={6} // Reducimos el padding
          bg={bgColor}
          boxShadow={shadow}
          borderRadius="lg"
        >
          <Heading size="lg" mb={4}> {/* Reducimos el margen inferior */}
            Factura #{factura.numero_factura}
          </Heading>

          {/* Detalles de la factura */}
          <Flex direction="row" gap={2} mb={6} flexWrap="nowrap"> {/* Reducimos el gap y el margen inferior */}
            {[
              { label: "Paciente", value: factura.paciente?.nombre },
              { label: "Obra social", value: factura.paciente?.obra_social?.nombre },
              { label: "Fecha de emisión", value: new Date(factura.fecha_facturada).toLocaleDateString("es-AR") },
              { label: "Monto", value: `$${factura.monto}` },
              { label: "Tipo", value: factura.es_consultorio ? "Consultorio" : "Particular" },
              { label: "Estado", value: factura.estado ? "Pagada" : "Pendiente" },
              { label: "Fecha de cobro", value: factura.fecha_cobro ? new Date(factura.fecha_cobro).toLocaleDateString("es-AR") : "No pagada" },
            ].map((item, index) => (
              <Box key={index} flex="1" minW="150px"> {/* Reducimos el ancho mínimo */}
                <Text fontWeight="bold" color="gray.700" fontSize="sm"> {/* Reducimos el tamaño de la fuente */}
                  {item.label}:
                </Text>
                <Text fontSize="sm">{item.value}</Text> {/* Reducimos el tamaño de la fuente */}
              </Box>
            ))}
          </Flex>
          <Divider mb={4} /> {/* Reducimos el margen inferior */}

          {/* Enviar recordatorio de pago */}
          <Heading as="h3" size="md" mb={4}> {/* Reducimos el margen inferior */}
            Enviar recordatorio de pago
          </Heading>

          <VStack spacing={4} align="stretch"> {/* Reducimos el espaciado */}
            {factura.paciente?.obra_social?.mail && (
              <FormControl>
                <FormLabel htmlFor="paraEmail" fontWeight="bold" fontSize="md" color="gray.700"> {/* Reducimos el tamaño de la fuente */}
                  Para:
                </FormLabel>
                <Input
                  id="paraEmail"
                  readOnly
                  value={factura.paciente.obra_social.mail}
                  bg="gray.100"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                  fontSize="sm" // Reducimos el tamaño de la fuente
                  height="40px" // Reducimos la altura
                />
              </FormControl>
            )}

            <FormControl>
              <FormLabel htmlFor="asuntoEmail" fontWeight="bold" fontSize="md" color="gray.700"> {/* Reducimos el tamaño de la fuente */}
                Asunto:
              </FormLabel>
              <Input
                id="asuntoEmail"
                readOnly
                value={`Solicitud de pago pendiente – Factura ${factura.numero_factura}`}
                bg="gray.100"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                fontSize="sm" // Reducimos el tamaño de la fuente
                height="40px" // Reducimos la altura
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="cuerpoEmail" fontWeight="bold" fontSize="md" color="gray.700"> {/* Reducimos el tamaño de la fuente */}
                Cuerpo del mensaje:
              </FormLabel>
              <Textarea
                id="cuerpoEmail"
                value={cuerpoEmail}
                readOnly
                height="200px" // Reducimos la altura
                placeholder="El mensaje se genera automáticamente con los datos de la factura."
                bg="gray.100"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                fontSize="sm" // Reducimos el tamaño de la fuente
                resize="none"
              />
            </FormControl>

            <Button colorScheme="green" size="md" mt={2}> {/* Reducimos el tamaño y el margen superior */}
              Enviar recordatorio
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default VerUnaFacturaPage;