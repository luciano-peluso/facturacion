import { BellIcon } from "@chakra-ui/icons";
import { Badge, Button, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Eye, Check } from "lucide-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const MenuNotificaciones = () => {
    const [notificationCount, setNotificacionCount] = useState(0);
    const [notificaciones, setNotificaciones] = useState([]);
    const navigate = useNavigate();

    const traerNotificaciones = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/notificaciones');
        setNotificacionCount(response.data.data.length);
        setNotificaciones(response.data.data);
      } catch (error) {
        console.error("No se pudo traer las notificaciones", error);
      }
    }

    const marcarComoLeida = async (id) => {
      try {
        // Enviar la solicitud PUT para marcar la notificación como leída
        const response = await axios.put(`http://localhost:3000/api/notificaciones/actualizar/${id}`);
        
        if (response.data.success) {
          setNotificaciones(prevNotificaciones =>
            prevNotificaciones.map(notificacion =>
              notificacion.id === id
                ? { ...notificacion, leida: true }
                : notificacion
            )
          );
          setNotificacionCount(prevCount => prevCount - 1); // Reducir el contador de notificaciones
        }
      } catch (error) {
        console.error("Error al marcar como leída la notificación", error);
      }
    };

    useEffect(() => {
        traerNotificaciones();
    },[])
    return (<>
      <Menu>
        <MenuButton
          as={Button}
          variant="outline"
          bg="white"
          _hover={{ bg: "pink.200" }}
          size="md"
          maxW={50}
          position="relative">
            <BellIcon />
              {notificationCount > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                fontSize="0.8em"
                position="absolute"
                top={0.5}
                right={2}
              >
                {notificationCount}
              </Badge>)}
        </MenuButton>
        <MenuList>
          { notificationCount > 0 ? (
            notificaciones.map(notificacion => (
              <MenuItem key={notificacion.id} display="flex" justifyContent="space-between" color={"black"} isDisabled={notificacion.leida}>
              {notificacion.mensaje}
              <HStack spacing={2}>
                  <IconButton
                      aria-label="Ver factura"
                      icon={<Eye size={16} />}
                      colorScheme="blue"
                      size="sm"
                      onClick={() => navigate(`/factura/${notificacion.factura_id}`)}
                  />
                  <IconButton
                      aria-label="Marcar como leída"
                      icon={<Check size={16} />}
                      colorScheme="green"
                      size="sm"
                      onClick={() => marcarComoLeida(notificacion.id)}
                  />
              </HStack>
          </MenuItem>
            ))
          ) : (
            <MenuItem
            color={"black"}
            isDisabled>No hay notificaciones</MenuItem>
          )}
        </MenuList>
      </Menu>
    </>
)}

export default MenuNotificaciones;