import { useState, useEffect } from "react";
import { Box, Input, Button, VStack, Text, Heading, FormControl, FormLabel, Select } from "@chakra-ui/react";
import axios from "axios";
import Sidebar from "../../componentes/sidebar";
import Header from "../../componentes/header";

export default function AfipLogin() {
    //  const { punto_de_venta, concepto, docTipo, docNro, impTotal, fechaServicioDesde, fechaServicioHasta, fechaVencimientoPago,
    // condicionIVAReceptorId } = req.body;
    const [puntosVenta, setPuntosVenta] = useState([]);
    const [tiposConcepto, setTiposConcepto] = useState([]);
    const [tiposDocumento, setTiposDocumento] = useState([]);
    const [tiposComprobante, setTiposComprobante] = useState([]);
    const [tiposAlicuota, setTiposAlicuota] = useState([]);
    const [tiposMoneda, setTiposMoneda] = useState([]);
    const [tiposOpciones, setTiposOpciones] = useState([]);
    const [tiposTributo, setTiposTributo] = useState([]);
    
    const [puntoDeVenta, setPuntoDeVenta] = useState('');
    const [concepto, setConcepto] = useState('');
    const [docTipo, setDocTipo] = useState('');
    const [docNro, setDocNro] = useState('');
    const [impTotal, setImpTotal] = useState(0);
    const [fechaServicioDesde, setFechaServicioDesde] = useState('');
    const [fechaServicioHasta, setFechaServicioHasta] = useState('');
    const [fechaVencimientoPago, setFechaVencimientoPago] = useState('');
    const [condicionIVAReceptorId, setCondicionIVAReceptorId] = useState('');

    const getPuntosVenta = async () => {
        try{
            const response = await axios.get('http://localhost:3000/api/afip/obtener-puntos-venta');
            setPuntosVenta(response.data.data);
        } catch (error) {
            console.error("Error:",error);
        }
    } 
    // Función para obtener los tipos de comprobante
    const getTiposComprobante = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/afip/obtener-tipo/comprobante');
            setTiposComprobante(response.data.data);
        } catch (error) {
            console.error("Error al obtener tipos de comprobante:", error);
        }
    };

    // Función para obtener los tipos de concepto
    const getTiposConcepto = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/afip/obtener-tipo/concepto');
            setTiposConcepto(response.data.data);
        } catch (error) {
            console.error("Error al obtener tipos de concepto:", error);
        }
    };
    // Función para obtener los tipos de documento
    const getTiposDocumento = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/afip/obtener-tipo/documento');
            setTiposDocumento(response.data.data);
        } catch (error) {
            console.error("Error al obtener tipos de documento:", error);
        }
    };
    // Función para obtener los tipos de alícuota
    const getTiposAlicuota = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/afip/obtener-tipo/alicuota');
            setTiposAlicuota(response.data.data);
        } catch (error) {
            console.error("Error al obtener tipos de alícuota:", error);
        }
    };
    // Función para obtener los tipos de moneda
    const getTiposMoneda = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/afip/obtener-tipo/moneda');
            setTiposMoneda(response.data.data);
        } catch (error) {
            console.error("Error al obtener tipos de moneda:", error);
        }
    };
    // Función para obtener los tipos de opciones
    const getTiposOpciones = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/afip/obtener-tipo/opciones');
            setTiposOpciones(response.data.data);
        } catch (error) {
            console.error("Error al obtener tipos de opciones:", error);
        }
    };
    // Función para obtener los tipos de tributo
    const getTiposTributo = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/afip/obtener-tipo/tributo');
            setTiposTributo(response.data.data);
        } catch (error) {
            console.error("Error al obtener tipos de tributo:", error);
        }
    };

    useEffect(() => {
        //getPuntosVenta();
        getTiposComprobante();
        getTiposConcepto();
        getTiposDocumento();
        getTiposAlicuota();
        getTiposMoneda();
        getTiposOpciones();
        getTiposTributo();
    }, []);

    const handleSubmit = async (e) => {
        
        // Crear el objeto con los datos del formulario
        const facturaData = {
            punto_de_venta: 1,
            concepto: concepto,
            docTipo: docTipo,
            docNro: docNro,
            impTotal: impTotal,
            fechaServicioDesde: fechaServicioDesde,
            fechaServicioHasta: fechaServicioHasta,
            fechaVencimientoPago: fechaVencimientoPago,
            condicionIVAReceptorId: condicionIVAReceptorId,
        };

        try {
            // Enviar los datos al backend para emitir la factura
            const response = await axios.post('http://localhost:3000/api/afip/crear/factura-c', facturaData);
            console.log('Factura emitida:', response.data);
        } catch (error) {
            console.error("Error al emitir la factura:", error);
        }
    };

  return (
    <Box className="container" display="flex" w="100%" minW="1400px">
        <Sidebar />

        <Box className="dashboard" overflow="scroll" flex="1" p={4}>
            <Header mensaje={"Nota: Puede tardar un poco en cargar las opciones."} />

            <Box
                maxW="800px"
                mx="auto"
                p={8}
                borderRadius="lg"
            >
                <Heading>Crear factura C</Heading>
                <VStack spacing={4}>
                    {/* Campo para seleccionar el punto de venta */}
                    <FormControl isRequired>
                        <FormLabel>Punto de Venta</FormLabel>
                        <Select
                            placeholder="Seleccione un punto de venta"
                            value={puntoDeVenta}
                            onChange={(e) => setPuntoDeVenta(e.target.value)}
                        >
                            {puntosVenta.map((pv) => (
                                <option key={pv.Id} value={pv.Id}>
                                    {pv.nombre}
                                </option>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Campo para seleccionar el concepto */}
                    <FormControl isRequired>
                    <FormLabel>Concepto</FormLabel>
                    <Select
                        placeholder="Seleccione un concepto"
                        value={concepto}
                        onChange={(e) => {
                            setConcepto(e.target.value);
                            // Si el concepto no es 2 o 3, limpiamos las fechas
                            if (e.target.value !== "2" && e.target.value !== "3") {
                                setFechaServicioDesde(null);
                                setFechaServicioHasta(null);
                                setFechaVencimientoPago(null);
                            }
                        }}
                    >
                        {tiposConcepto.map((concepto) => (
                            <option key={concepto.Id} value={concepto.Id}>
                                {concepto.Desc}
                            </option>
                        ))}
                    </Select>
                </FormControl>

                    {/* Campo para seleccionar el tipo de documento */}
                    <FormControl isRequired>
                        <FormLabel>Tipo de Documento</FormLabel>
                        <Select
                            placeholder="Seleccione un tipo de documento"
                            value={docTipo}
                            onChange={(e) => {
                                setDocTipo(e.target.value);
                                // Si el tipo de documento es Consumidor Final (Id = 99), establecer docNro en 0
                                if (e.target.value === "99") {
                                    setDocNro("0");
                                } else {
                                    setDocNro(""); // Limpiar el campo si no es Consumidor Final
                                }
                            }}
                        >
                            {tiposDocumento.map((doc) => (
                                <option key={doc.Id} value={doc.Id}>
                                    {doc.Desc} {doc.Id === 99 && "(Consumidor Final)"} {/* Agregar texto adicional para Consumidor Final */}
                                </option>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Campo para ingresar el número de documento */}
                    <FormControl isRequired>
                        <FormLabel>Número de Documento (del comprador)</FormLabel>
                        <Input
                            type="text"
                            value={docNro}
                            onChange={(e) => setDocNro(e.target.value)}
                            isDisabled={docTipo === "99"} // Deshabilitar el campo si es Consumidor Final
                        />
                    </FormControl>

                    {/* Campo para ingresar el importe total */}
                    <FormControl isRequired>
                        <FormLabel>Importe Total</FormLabel>
                        <Input
                            type="number"
                            value={impTotal}
                            onChange={(e) => setImpTotal(e.target.value)}
                        />
                    </FormControl>

                    {/* Campo para ingresar la fecha de servicio desde */}
                    {(concepto === "2" || concepto === "3") && (
                    <>
                        {/* Campo para ingresar la fecha de servicio desde */}
                        <FormControl isRequired>
                            <FormLabel>Fecha de Servicio Desde</FormLabel>
                            <Input
                                type="date"
                                value={fechaServicioDesde || ""}
                                onChange={(e) => setFechaServicioDesde(e.target.value)}
                            />
                        </FormControl>

                        {/* Campo para ingresar la fecha de servicio hasta */}
                        <FormControl isRequired>
                            <FormLabel>Fecha de Servicio Hasta</FormLabel>
                            <Input
                                type="date"
                                value={fechaServicioHasta || ""}
                                onChange={(e) => setFechaServicioHasta(e.target.value)}
                            />
                        </FormControl>

                        {/* Campo para ingresar la fecha de vencimiento del pago */}
                        <FormControl isRequired>
                            <FormLabel>Fecha de Vencimiento del Pago</FormLabel>
                            <Input
                                type="date"
                                value={fechaVencimientoPago || ""}
                                onChange={(e) => setFechaVencimientoPago(e.target.value)}
                            />
                        </FormControl>
                    </>)}

                    {/* Campo para seleccionar la condición de IVA del receptor */}
                    <FormControl isRequired>
                        <FormLabel>Condición de IVA del Receptor</FormLabel>
                        <Select
                            placeholder="Seleccione una condición de IVA"
                            value={condicionIVAReceptorId}
                            onChange={(e) => setCondicionIVAReceptorId(e.target.value)}
                        >
                            <option key={1} value={1}>
                                IVA Responsable Inscripto
                            </option>
                            <option key={6} value={6}>
                                Responsable Monotributo
                            </option>
                            <option key={13} value={13}>
                                Monotributista Social
                            </option>
                            <option key={16} value={16}>
                                Monotributo Trabajador Independiente Promovido
                            </option>
                            <option key={4} value={4}>
                                IVA Sujeto Exento
                            </option>
                            <option key={5} value={5}>
                                Consumidor Final
                            </option>
                            <option key={7} value={7}>
                                Sujeto No Categorizado  
                            </option>
                            <option key={8} value={8}>
                                Proveedor del Exterior
                            </option>
                            <option key={9} value={9}>
                                Cliente del Exterior
                            </option>
                            <option key={10} value={10}>
                                IVA Liberado – Ley N° 19.640
                            </option>
                            <option key={15} value={15}>
                                IVA No Alcanzado
                            </option>
                        </Select>
                    </FormControl>

                    {/* Botón para enviar el formulario */}
                    <Button type="submit" colorScheme="blue" width="100%" onClick={() => handleSubmit()}>
                        Emitir Factura
                    </Button>
                </VStack>
            </Box>
        </Box>
    </Box>
  );
}
