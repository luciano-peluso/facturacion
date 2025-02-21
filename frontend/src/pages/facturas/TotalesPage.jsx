import { Box, Button, Card, CardBody, CardHeader, Container, Divider, Flex, FormControl, FormLabel, Heading, Select, Table, Tbody, Td, Text, Th, Thead, Tr, Icon } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons"; // Importamos los íconos
import React, { useEffect, useState } from "react";
import Header from "../../componentes/header";
import * as XLSX from "xlsx";
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Sidebar from "../../componentes/Sidebar";

const TotalesPage = () => {
    const [mesSeleccionado, setMesSeleccionado] = useState("");
    const [anioSeleccionado, setAnioSeleccionado] = useState("");
    const [facturas, setFacturas] = useState([]);
    const [porcentajeComision, setPorcentajeComision] = useState([]);
    const [totales, setTotales] = useState({
        total_bruto: 0,
        total_neto: 0,
        total_comision: 0
    });

    // Estado para el ordenamiento
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    // Función para ordenar las facturas
    const sortedFacturas = React.useMemo(() => {
        let sortableFacturas = [...facturas];
        if (sortConfig.key !== null) {
            sortableFacturas.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableFacturas;
    }, [facturas, sortConfig]);

    // Función para cambiar el orden al hacer clic en un encabezado
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Función para obtener el ícono de ordenamiento
    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />;
        }
        return null;
    };

    const getFacturasPorMes = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/facturas/mes/${mesSeleccionado}/${anioSeleccionado}`);
            setFacturas(response.data.data);
            return response.data.data;
        } catch (error) {
            console.error("Error al obtener facturas:", error);
            return [];
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
    };

    const calcularFacturasPorMes = async () => {
        try {
            const nuevasFacturas = await getFacturasPorMes();
            if (!nuevasFacturas || nuevasFacturas.length === 0) {
                console.warn("No hay facturas para calcular.");
                return;
            }
            let total = nuevasFacturas.reduce((acc, factura) => acc + parseFloat(factura.monto), 0);
            let totalConsultorio = nuevasFacturas
                .filter(factura => factura.es_consultorio)
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

    const exportar = () => {
        const wsData = [
            [],
            ["",{ v: "Fecha: "+ format(new Date(mesSeleccionado), "MMMM", { locale: es }) + ` ${anioSeleccionado}`}, 
                "","",{ v: `{NOMBRE DEL PROFESIONAL}`}], // Encabezado de la fecha
            ["",{ v: "Honorarios profesionales correspondientes a "+ format(new Date(mesSeleccionado), "MMMM", { locale: es }) + " de " + anioSeleccionado}], // Título
            [], // Espacio en blanco
            ["",{ v: "Obra Social"}, { v: "Paciente" }, 
                { v: "Factura" }, { v: "Mes" }, { v: "Total" }], // Encabezados de la tabla
            ...sortedFacturas.map(factura => [
                "",factura.paciente.obra_social.nombre,
                factura.paciente.nombre,
                {v: `${factura.numero_factura}`},
                {v: format(new Date(factura.fecha_facturada), "MMMM", { locale: es })},
                `$ ${Number(factura.monto).toFixed(2)}`
            ]),
            [], // Espacio en blanco antes del total
            ["", "", "", "", "Total", { v: ` $ ${totales.total_bruto.toFixed(2)}`}]
        ];
    
        // Crear la hoja de cálculo
        const ws = XLSX.utils.aoa_to_sheet(wsData);
    
        ws["!merges"] = [
            { s: {r:1, c:4}, e:{r:1,c:5}},
            { s: {r:2, c:1}, e:{r:2, c:5}}
        ]
        // Aplicar ancho de columnas
        ws["!cols"] = [
            { wch: 10 },
            { wch: 20 }, // Obra Social
            { wch: 20 }, // Paciente
            { wch: 10 }, // Factura
            { wch: 12 }, // Mes
            { wch: 12 }, // Total
            { wch: 12 }  // Comision
        ];
    
        // Crear el libro de trabajo y agregar la hoja
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Facturas");
    
        // Exportar el archivo
        XLSX.writeFile(wb, `facturas_${mesSeleccionado}_${anioSeleccionado}.xlsx`);
    };
    

    useEffect(() => {
        getPorcentajeComision();
    }, []);

    return (
        <Box className="container" display="flex" w="100%" minW="1400px">
            <Sidebar />

            <Box className="dashboard" overflow="hidden" flex="1" p={4}>
                <Header titulo={"Totales percibidos por mes"}/>
                <Box w={"100%"} p={8} paddingTop={0} borderRadius="lg">
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
                        <Button colorScheme="green" onClick={() => calcularFacturasPorMes()} minW={"70"}>
                            Buscar
                        </Button>
                    </Flex>
                    <Divider mt={5} mb={5} />
                    
                    {facturas.length > 0 ? (
                        <Box mt={4} p={4} border="1px solid" borderColor="gray.300" borderRadius="md">
                            <Heading size="md" mb={4} textAlign="center">Facturas encontradas</Heading>
                            
                            {/* Tabla de facturas */}
                            <Table variant="striped" colorScheme="teal" size="sm">
                                <Thead>
                                    <Tr>
                                        <Th cursor="pointer" onClick={() => requestSort("numero_factura")}>
                                            Número Factura {getSortIcon("numero_factura")}
                                        </Th>
                                        <Th cursor="pointer" onClick={() => requestSort("monto")}>
                                            Monto {getSortIcon("monto")}
                                        </Th>
                                        <Th cursor="pointer" onClick={() => requestSort("fecha_facturada")}>
                                            Fecha Facturada {getSortIcon("fecha_facturada")}
                                        </Th>
                                        <Th cursor="pointer" onClick={() => requestSort("fecha_cobro")}>
                                            Fecha Cobro {getSortIcon("fecha_cobro")}
                                        </Th>
                                        <Th cursor="pointer" onClick={() => requestSort("es_consultorio")}>
                                            Tipo {getSortIcon("es_consultorio")}
                                        </Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {sortedFacturas.map((factura, index) => (
                                        <Tr key={factura.id}>
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
                            <Button mt={5} colorScheme={"green"} color={"white"} onClick={() => exportar()}>
                                Exportar a Excel
                            </Button>
                        </Box>
                    ) : (
                        <Text mt={4} color="red.500" textAlign="center">No hay facturas para este período.</Text>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default TotalesPage;