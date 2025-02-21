import { useState, useEffect } from "react";
import { Box, Input, Button, VStack, Text, Heading, FormControl, FormLabel, Select, HStack, useToast } from "@chakra-ui/react";
import axios from "axios";
import Sidebar from "../../componentes/Sidebar";
import Header from "../../componentes/header";
import { useNavigate } from "react-router-dom";

export default function AfipLogin() {
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [CAE, setCAE] = useState({
        CAE: "",
        CAEFchVto: "",
    })
    const unidades = [
        { id: "00", descripcion: "SIN DESCRIPCION" },
        { id: "01", descripcion: "KILOGRAMO" },
        { id: "02", descripcion: "METROS" },
        { id: "03", descripcion: "METRO CUADRADO" },
        { id: "04", descripcion: "METRO CUBICO" },
        { id: "05", descripcion: "LITROS" },
        { id: "06", descripcion: "1000 KILOWATT HORA" },
        { id: "07", descripcion: "UNIDAD" },
        { id: "08", descripcion: "PAR" },
        { id: "09", descripcion: "DOCENA" },
        { id: "10", descripcion: "QUILATE" },
        { id: "11", descripcion: "MILLAR" },
        { id: "12", descripcion: "MEGA U. INTER. ACT. ANTIB" },
        { id: "13", descripcion: "UNIDAD INT. ACT. INMUNG" },
        { id: "14", descripcion: "GRAMO" },
        { id: "15", descripcion: "MILIMETRO" },
        { id: "16", descripcion: "MILIMETRO CUBICO" },
        { id: "17", descripcion: "KILOMETRO" },
        { id: "18", descripcion: "HECTOLITRO" },
        { id: "19", descripcion: "MEGA UNIDAD INT. ACT. INMUNG" },
        { id: "20", descripcion: "CENTIMETRO" },
        { id: "21", descripcion: "KILOGRAMO ACTIVO" },
        { id: "22", descripcion: "GRAMO ACTIVO" },
        { id: "23", descripcion: "GRAMO BASE" },
        { id: "24", descripcion: "UIACTHOR" },
        { id: "25", descripcion: "JGO.PQT. MAZO NAIPES" },
        { id: "26", descripcion: "MUIACTHOR" },
        { id: "27", descripcion: "CENTIMETRO CUBICO" },
        { id: "28", descripcion: "UIACTANT" },
        { id: "29", descripcion: "TONELADA" },
        { id: "30", descripcion: "DECAMETRO CUBICO" },
        { id: "31", descripcion: "HECTOMETRO CUBICO" },
        { id: "32", descripcion: "KILOMETRO CUBICO" },
        { id: "33", descripcion: "MICROGRAMO" },
        { id: "34", descripcion: "NANOGRAMO" },
        { id: "35", descripcion: "PICOGRAMO" },
        { id: "36", descripcion: "MUIACTANT" },
        { id: "37", descripcion: "UIACTIG" },
        { id: "41", descripcion: "MILIGRAMO" },
        { id: "47", descripcion: "MILILITRO" },
        { id: "48", descripcion: "CURIE" },
        { id: "49", descripcion: "MILICURIE" },
        { id: "50", descripcion: "MICROCURIE" },
        { id: "51", descripcion: "U.INTER. ACT. HORMONAL" },
        { id: "52", descripcion: "MEGA U. INTER. ACT. HOR." },
        { id: "53", descripcion: "KILOGRAMO BASE" },
        { id: "54", descripcion: "GRUESA" },
        { id: "55", descripcion: "MUIACTIG" },
        { id: "61", descripcion: "KILOGRAMO BRUTO" },
        { id: "62", descripcion: "PACK" },
        { id: "63", descripcion: "HORMA" },
        { id: "97", descripcion: "SEÑAS/ANTICIPOS" },
        { id: "98", descripcion: "OTRAS UNIDADES" },
        { id: "99", descripcion: "BONIFICACION" }
    ];

    const [puntosVenta, setPuntosVenta] = useState([]);
    const [tiposConcepto, setTiposConcepto] = useState([]);
    const [tiposDocumento, setTiposDocumento] = useState([]);
    const [tiposComprobante, setTiposComprobante] = useState([]);
    const [condicionesFrenteIva, setCondicionesFrenteIva] = useState([]);
    const [pdfUrl, setPdfUrl] = useState(null); // Estado para guardar la URL del PDF
    const [isGenerarDisabled, setIsGenerarDisabled] = useState(false); // Estado para habilitar/deshabilitar "Generar Factura"
    const [isVerDisabled, setIsVerDisabled] = useState(true);
    const [configuracionAfip, setConfiguracionAfip] = useState([]);

    const [cantidad, setCantidad] = useState('')
    const [unidad, setUnidad] = useState('')
    const [precioUnitario, setPrecioUnitario] = useState('')
    const [condicionVenta, setCondicionVenta] = useState('')
    const [servicio, setServicio] = useState('');
    const [puntoDeVenta, setPuntoDeVenta] = useState('');
    const [concepto, setConcepto] = useState('');
    const [docTipo, setDocTipo] = useState('');
    const [docNro, setDocNro] = useState('');
    const [impTotal, setImpTotal] = useState(0);
    const [fechaServicioDesde, setFechaServicioDesde] = useState('');
    const [fechaServicioHasta, setFechaServicioHasta] = useState('');
    const [fechaVencimientoPago, setFechaVencimientoPago] = useState('');
    const [condicionIVAReceptorId, setCondicionIVAReceptorId] = useState(0);
    const [razonSocialReceptor, setRazonSocialReceptor] = useState('')
    const [domicilioReceptor, setDomicilioReceptor] = useState('')

    const [estaConfigurado, setEstaConfigurado] = useState(false);
    const getVerificacionInstancia = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/afip/verificar");
            setEstaConfigurado(response.data.success);
    
            // Si la verificación es exitosa, llama a las funciones adicionales
            if (response.data.success) {
                getTiposComprobante();
                getTiposConcepto();
                getTiposDocumento();
                getCondicionesFrenteIva();
                getConfiguracionAfip();
            }
        } catch (error) {
            console.error("Error al traer la verificacion de la instancia:", error);
            setEstaConfigurado(false); // Asegúrate de establecer el estado en false en caso de error
        }
    };
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

    const getCondicionesFrenteIva = async() => {
        try {
            const response = await axios.get('http://localhost:3000/api/condicionIva');
            setCondicionesFrenteIva(response.data.data);
        } catch (error) {
            console.error("Error al obtener tipos de documento:", error);
        }
    }
    
    const getConfiguracionAfip = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/configuracion/afip');
            setConfiguracionAfip(response.data.data);
        } catch (error) {
            console.error("Error al obtener la configuracion:", error);
        }
    }

    useEffect(() => {
        getVerificacionInstancia();
        
    }, []);

    const handleSubmit = async (e) => {
        setIsLoading(true);
        console.log("Condicion iva receptor id:",condicionIVAReceptorId);
        // Crear el objeto con los datos del formulario
        const facturaData = {
            punto_de_venta: puntoDeVenta,
            concepto: concepto,
            docTipo: docTipo,
            docNro: docNro,
            impTotal: precioUnitario * cantidad,
            fechaServicioDesde: fechaServicioDesde,
            fechaServicioHasta: fechaServicioHasta,
            fechaVencimientoPago: fechaVencimientoPago,
            condicionIVAReceptorId: condicionIVAReceptorId,
        };

        try {
            // Enviar los datos al backend para emitir la factura
            const response = await axios.post('http://localhost:3000/api/afip/crear/factura-c', facturaData);
            console.log('Factura emitida:', response.data);
            
            setCAE(response.data.data)
        } catch (error) {
            console.error("Error al emitir la factura:", error);
        }
    };
    
    useEffect(() => {
        if( CAE.CAE && CAE.CAEFchVto){
            generarQR();
        }
    }, [CAE])
    
    const generarQR = async () => {
        try {
            const qrData = {
                ptoVta: puntoDeVenta,
                importe: precioUnitario * cantidad,
                tipoDocRec: docTipo,
                nroDocRec: docNro,
                CAE: CAE.CAE 
            }
            const response = await axios.post('http://localhost:3000/api/afip/crear/codigo-qr', qrData);
            generarPDF(response.data.data);
        } catch(error){ 
            console.error("Error al generar el QR de la factura:", error);
        }
    } 

    const generarPDF = async (urlQR) => {
        // Deshabilitar el botón "Generar Factura" mientras se procesa
        setIsGenerarDisabled(true);
        try {
            const condicionEncontrada = condicionesFrenteIva.find(condicion => condicion.id === Number(condicionIVAReceptorId));
            const dataFactura = {
                qrCodeImage: urlQR,
                razonSocial: configuracionAfip.razon_social,
                domicilio: configuracionAfip.domicilio,
                condicionIva: configuracionAfip.CondicionIva.descripcion,
                puntoDeVenta: puntoDeVenta,
                ingresosBrutos: configuracionAfip.ingresos_brutos,
                inicioActividades: configuracionAfip.inicio_actividades,
                inicioFechaFacturada: (concepto > 1 ? fechaServicioDesde : new Date(Date.now()).toLocaleString().split(',')[0]),
                finFechaFacturada: (concepto > 1 ? fechaServicioHasta : new Date(Date.now()).toLocaleString().split(',')[0]),
                vencimientoPago: (concepto > 1 ? fechaVencimientoPago: new Date(Date.now()).toLocaleString().split(',')[0]),
                cuitReceptor: (docNro > 0 ? docNro : ""),
                razonSocialReceptor: (docNro > 0 ? razonSocialReceptor : ""),
                condicionIvaReceptor: condicionEncontrada?.descripcion,
                domicilioReceptor: (docNro > 0 ? domicilioReceptor : ""),
                condicionVenta: condicionVenta,
                servicio: servicio,
                cantidad: cantidad,
                precioUnitario: precioUnitario,
                CAE: CAE.CAE,
                vencimientoCAE: CAE.CAEFchVto.replace(/-/g,'/')
            }
                        
            const response = await axios.post('http://localhost:3000/api/afip/crear/factura-pdf', dataFactura);

            // Obtener la URL del PDF desde la respuesta
            const pdfUrl = response.data.data;

            // Guardar la URL en el estado y habilitar el botón "Ver Factura"
            setPdfUrl(pdfUrl);
            setIsVerDisabled(false);
            setIsLoading(false);
            toast({
                title: "Factura emitida con éxito",
                status: "success",
                description: "Ya está disponible el pdf",
                duration: 5000,
                isClosable: true
            })
        } catch (error) {
            console.error("Error al generar el PDF de la factura:", error);
            toast({
                title: "Error al generar la factura",
                status: "error",
                description: "Error al generar el PDF de la factura",
                duration: 5000,
                isClosable: true
            })
        }
    }

    const obtenerDatosContribuyente = async () => {
        if (docTipo === "80" && docNro) {
            try {
                const response = await axios.get(`http://localhost:3000/api/afip/obtener-datos-contribuyente/${docNro}`);
                const { razonSocial, domicilio } = response.data.data;
                console.log(response.data.data)
                setRazonSocialReceptor(razonSocial);
                setDomicilioReceptor(domicilio);
            } catch (error) {
                console.error("Error fetching contribuyente data:", error);
            }
        }
    };

    const handleVerFactura = () => {
        // Redirigir al usuario al enlace de la factura
        window.open(pdfUrl, '_blank');
    };

    useEffect(() => {
        if(docNro.length >= 11){
        obtenerDatosContribuyente();}
    }, [docTipo, docNro]);

  return (
    <Box className="container" display="flex" w="100%" minW="1400px">
        <Sidebar />

        <Box className="dashboard" overflow="scroll" flex="1" p={4}>
            <Header mensaje={"Nota: Puede tardar un poco en cargar las opciones."} />

            <Box
                maxW="800px"
                mx="auto"
                p={8}
                pt={0}
                borderRadius="lg"
            >
                {estaConfigurado? (
                <>
                <Heading pb={3}>Crear factura C</Heading>
                <VStack spacing={4}>
                    {/* Campo para seleccionar el punto de venta */}
                    <FormControl isRequired>
                        <FormLabel>Punto de Venta</FormLabel>
                        <Select
                            placeholder="Seleccione un punto de venta"
                            value={puntoDeVenta}
                            onChange={(e) => setPuntoDeVenta(e.target.value)}
                        >
                            {/* {puntosVenta.map((pv) => (
                                <option key={pv.Id} value={pv.Id}>
                                    {pv.nombre}
                                </option>
                            ))} */}
                            <option key={1} value={1}>
                                00001
                            </option>
                            <option key={2} value={2}>
                                00002
                            </option>
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
                            <FormLabel>Número de Documento del receptor</FormLabel>
                            <Input
                                type="text"
                                placeholder="Ingrese el CUIL/CUIT/DNI/otro del receptor"
                                value={docNro}
                                onChange={(e) => setDocNro(e.target.value)}
                                isDisabled={docTipo === "99"} // Deshabilitar el campo si es Consumidor Final
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Razon Social receptor</FormLabel>
                            <Input 
                                placeholder="Ingrese la razon social del receptor"
                                value={razonSocialReceptor || ""}
                                onChange={(e) => setRazonSocialReceptor(e.target.value)}
                                isDisabled={docTipo === "99"} // Deshabilitar el campo si es Consumidor Final
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Domicilio receptor</FormLabel>
                            <Input 
                                placeholder="Ingrese el domicilio del receptor"
                                value={domicilioReceptor || ""}
                                onChange={(e) => setDomicilioReceptor(e.target.value)}
                                isDisabled={docTipo === "99"} // Deshabilitar el campo si es Consumidor Final
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Servicio</FormLabel>
                            <Input 
                                placeholder="Ingrese la descripcion del servicio prestado"
                                value={servicio || ""}
                                onChange={(e) => setServicio(e.target.value)}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Cantidad</FormLabel>
                            <Input 
                                type="number"
                                placeholder="Ingrese la cantidad del servicio prestado"
                                value={cantidad || ""}
                                onChange={(e) => setCantidad(e.target.value)}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Unidades</FormLabel>
                            <Select 
                                placeholder="Seleccione la unidad correspondiente del servicio prestado"
                                value={unidad || ""}
                                onChange={(e) => setUnidad(e.target.value)}
                           >
                            {unidades.map((unidadExtra) => (
                                <option key={unidadExtra.id} value={unidadExtra.descripcion}>
                                    {unidadExtra.descripcion}
                                </option>
                            ))}
                           </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Precio Unitario</FormLabel>
                            <Input 
                                type="number"
                                placeholder="Ingrese el precio unitario"
                                value={precioUnitario || ""}
                                onChange={(e) => setPrecioUnitario(e.target.value)}
                            />
                        </FormControl>
                        {/* Campo para ingresar el importe total */}
                        <FormControl isRequired>
                            <FormLabel>Importe Total</FormLabel>
                            <Input
                                type="number"
                                value={precioUnitario * cantidad}
                                onChange={(e) => setImpTotal(e.target.value)}
                                isDisabled={precioUnitario && cantidad}
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
                                {condicionesFrenteIva.map(condicionFrenteIva => (
                                    <option key={condicionFrenteIva.id} value={condicionFrenteIva.id}>
                                        {condicionFrenteIva.descripcion}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        
                        <FormControl isRequired>
                            <FormLabel>Condicion venta</FormLabel>
                            <Select
                                value={condicionVenta || ""}
                                placeholder="Seleccione una condicion de venta"
                                onChange={(e) => setCondicionVenta(e.target.value)}>
                            <option key={1} value={"Contado"}>
                                Contado
                            </option>
                            <option key={2} value={"Tarjeta de Débito"}>
                            Tarjeta de Débito
                            </option>
                            <option key={3} value={"Tarjeta de Crédito"}>
                                Tarjeta de Crédito
                            </option>
                            <option key={4} value={"Cuenta Corriente"}>
                                Cuenta Corriente
                            </option>
                            <option key={5} value={"Cheque"}>
                                Cheque
                            </option>
                            <option key={6} value={"Otra"}>
                                Otra
                            </option></Select>
                        </FormControl>
                    </VStack>
                    {/* Botón para enviar el formulario */}
                    <HStack mt={5}>
                        <Button type="submit" colorScheme="blue" width="100%" onClick={() => handleSubmit()} isDisabled={isGenerarDisabled} isLoading={isLoading}
                            loadingText="Emitiendo factura...">
                            Emitir Factura
                        </Button>
                        <Button colorScheme="red" width={"100%"} onClick={() => handleVerFactura()} isDisabled={isVerDisabled}>
                            Ver factura
                        </Button>
                    </HStack>
                </>) 
                :(
                    <>  
                        <VStack>
                            <Text>La configuración de AFIP/ARCA no está completa!</Text>
                            <Text>Por favor, dirigase a la configuración para poder emitir comprobantes</Text>
                            <Button onClick={() => navigate('/configuracion')}>Ir a configuracion</Button>
                        </VStack>
                    </>
                )}
                
            </Box>
        </Box>
    </Box>
  );
}
