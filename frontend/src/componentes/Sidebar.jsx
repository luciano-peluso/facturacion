import { Button, MenuButton, MenuItem, MenuList, VStack, Box, Heading, Menu } from "@chakra-ui/react";
import {  } from "lucide-react";
import React from "react"
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    return(<>
        {/* Sidebar */}
        <Box className="sidebar" minW="250px" bg="#F5F5F5" p={4}>
        <Heading size="lg" pb={5} mt={5}>Facturador</Heading>
        <nav>
        <VStack spacing={5} >
            <Menu>
                <MenuButton
                textAlign={"left"} w={"90%"} className="btn" bg={"transparent"}
                color={"black"} _hover={{ bg:"#09e4b8", color: "white" }}>
                📄 Facturas
                </MenuButton>
                <MenuList>
                    <VStack>
                        <MenuItem onClick={() => navigate('/crear-facturas')}>
                            ➕ Crear factura
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/')}>
                            👀 Ver facturas
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/calcular-totales')}>
                            📈 Totales percibidos por mes
                        </MenuItem>
                    </VStack>
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton textAlign={"left"} w={"90%"} className="btn"  bg={"transparent"} color={"black"} _hover={{ bg:"#09e4b8", color: "white" }}>
                👤 Pacientes
                </MenuButton>
                <MenuList>
                    <VStack>
                        <MenuItem onClick={() => navigate('/crear-pacientes')}>
                            ➕ Crear paciente
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/ver-pacientes')}>
                            👀 Ver pacientes
                        </MenuItem>
                    </VStack>
                </MenuList>
            </Menu><Menu >
                <MenuButton textAlign={"left"} w={"90%"} className="btn"  bg={"transparent"} color={"black"} _hover={{ bg:"#09e4b8", color: "white" }}>
                🏥 Obras sociales
                </MenuButton>
                <MenuList>
                    <VStack>
                        <MenuItem onClick={() => navigate('/crear-obras-sociales')}>
                            ➕ Crear Obra social
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/ver-obras-sociales')}>
                            👀 Ver obras sociales
                        </MenuItem>
                    </VStack>
                </MenuList>
            </Menu><Menu >
                <MenuButton textAlign={"left"} w={"90%"} className="btn"  bg={"transparent"} color={"black"} _hover={{ bg:"#09e4b8", color: "white" }}>
                👪 Encargados
                </MenuButton>
                <MenuList>
                    <VStack>
                        <MenuItem onClick={() => navigate('/crear-encargado')}>
                        ➕ Crear encargado
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/ver-encargados')}   >
                            👀 Ver encargados
                        </MenuItem>
                    </VStack>
                </MenuList>
            </Menu>
            <Button justifyContent={"start"} w={"90%"} fontWeight={"normal"} 
            fontSize={18} bg={"transparent"} color={"black"} _hover={{ bg:"#09e4b8", color: "white" }}
            paddingLeft={3} onClick={() => navigate('/afip')}>
                🤑 AFIP</Button>
            <Button justifyContent={"start"} w={"90%"} fontWeight={"normal"} 
            fontSize={18} bg={"transparent"} color={"black"} _hover={{ bg:"#09e4b8", color: "white" }}
            paddingLeft={3} onClick={() => navigate('/configuracion')}>
                🔧 Configuracion</Button>
            <Button justifyContent={"start"} w={"90%"} fontWeight={"normal"} 
            fontSize={18} bg={"transparent"} color={"black"} _hover={{ bg:"#09e4b8", color: "white" }}
            paddingLeft={3}>
                ❌ Cerrar Sesión</Button>
        </VStack>
        </nav>
        </Box>
        </>
    )};

export default Sidebar;