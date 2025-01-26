import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Heading, Box, Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import Header from "../../componentes/header";

const FacturasPage = () => {
    const [facturas, setFacturas] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const traerFacturas = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/facturas");
            setFacturas(response.data.data);
        } catch (error) {
            console.log("Error al traer las facturas: ", error);
        }
    };

    useEffect(() => {
        traerFacturas();
    }, []);

    const sortFacturas = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sortedFacturas = [...facturas].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === "asc" ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === "asc" ? 1 : -1;
            }
            return 0;
        });
        setFacturas(sortedFacturas);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === "asc" ? <TriangleUpIcon /> : <TriangleDownIcon />;
    };

    return (
        <>
        <Header></Header>
        <Container maxW="container.xl" py={8}>
            <Heading as="h1" size="lg" mb={6}>
                Listado de Facturas
            </Heading>
            <Box overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
                <Table variant="striped" size="md">
                    <Thead>
                        <Tr>
                            <Th>
                                <IconButton
                                    onClick={() => sortFacturas("paciente")}
                                    aria-label="Ordenar por nombre del cliente"
                                    icon={getSortIcon("paciente")}
                                    size="sm"
                                    variant="ghost"
                                />
                                Nombre del Cliente
                            </Th>
                            <Th>
                                <IconButton
                                    onClick={() => sortFacturas("os")}
                                    aria-label="Ordenar por obra social"
                                    icon={getSortIcon("os")}
                                    size="sm"
                                    variant="ghost"
                                />
                                Obra Social
                            </Th>
                            <Th>
                                <IconButton
                                    onClick={() => sortFacturas("num_factura")}
                                    aria-label="Ordenar por número de factura"
                                    icon={getSortIcon("num_factura")}
                                    size="sm"
                                    variant="ghost"
                                />
                                Numero de factura
                            </Th>
                            <Th>
                                <IconButton
                                    onClick={() => sortFacturas("valor")}
                                    aria-label="Ordenar por valor"
                                    icon={getSortIcon("valor")}
                                    size="sm"
                                    variant="ghost"
                                />
                                Valor
                            </Th>
                            <Th>
                                <IconButton
                                    onClick={() => sortFacturas("fecha")}
                                    aria-label="Ordenar por fecha"
                                    icon={getSortIcon("fecha")}
                                    size="sm"
                                    variant="ghost"
                                />
                                Fecha
                            </Th>
                            <Th>
                                <IconButton
                                    onClick={() => sortFacturas("estado")}
                                    aria-label="Ordenar por estado"
                                    icon={getSortIcon("estado")}
                                    size="sm"
                                    variant="ghost"
                                />
                                Cobrado
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {facturas.map((factura) => (
                            <Tr key={factura.id}>
                                <Td>{factura.paciente}</Td>
                                <Td>{factura.os}</Td>
                                <Td>{factura.num_factura}</Td>
                                <Td isNumeric>${factura.valor}</Td>
                                <Td>{factura.fecha}</Td>
                                <Td>{factura.estado ? "Cobrado" : "Pendiente"}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Container>
        </>
    );
};

export default FacturasPage;