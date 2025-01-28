import { BellIcon } from "@chakra-ui/icons";
import { Badge, Button, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";


const MenuNotificaciones = () => {
    const [notificationCount, setNotificacionCount] = useState(0);
    const [notificaciones, setNotificaciones] = useState([]);

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
        {/*<Button
          variant="outline"
          bg="white"
          _hover={{ bg: "pink.200" }}
          size="md"
          maxW={50}
          position="relative"  // Hace que el Badge esté posicionado sobre el Button
      >
          <BellIcon />
          {notificationCount > 0 && (
              <Badge
                  colorScheme="red"
                  borderRadius="full"
                  fontSize="0.8em"
                  position="absolute" // Lo hace flotar sobre el icono
                  top={0.5}  // Ajusta la posición vertical
                  right={2}  // Ajusta la posición horizontal
              >
                  {notificationCount}
              </Badge>
          )}
      </Button>*/}
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
            </Badge>
          )}
        </MenuButton>
        <MenuList>
          { notificationCount > 0 ? (
            notificaciones.map(notificacion => (
              <MenuItem
                key={notificacion.id}
                onClick={() => marcarComoLeida(notificacion.id)}
                isDisabled={notificacion.leida}
                color={"black"}
                >
                {notificacion.mensaje}
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