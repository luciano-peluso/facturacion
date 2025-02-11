import {
  Badge,
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Box,
} from "@chakra-ui/react";
import { Eye, Check, ArrowRight, Megaphone } from "lucide-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MenuNotificaciones = () => {
  const [notificationCount, setNotificacionCount] = useState(0);
  const [notificaciones, setNotificaciones] = useState([]);
  const navigate = useNavigate();

  const traerNotificaciones = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/notificaciones");
      setNotificacionCount(response.data.data.length);
      setNotificaciones(response.data.data);
    } catch (error) {
      console.error("No se pudo traer las notificaciones", error);
    }
  };

  const marcarComoLeida = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/notificaciones/actualizar/${id}`
      );
      if (response.data.success) {
        setNotificaciones((prevNotificaciones) =>
          prevNotificaciones.map((n) =>
            n.id === id ? { ...n, leida: true } : n
          )
        );
        setNotificacionCount((prevCount) => prevCount - 1);
      }
    } catch (error) {
      console.error("Error al marcar como leída la notificación", error);
    }
  };

  useEffect(() => {
    traerNotificaciones();
  }, []);

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="outline"
        bg="white"
        _hover={{ bg: "#09e4b8" }}
        size="md"
        w="50px"
        h="50px"
        p={0}
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Megaphone size={22} />
        </Box>
        {notificationCount > 0 && (
          <Badge
            colorScheme="red"
            borderRadius="full"
            fontSize="0.8em"
            position="absolute"
            top="2px"
            right="2px"
          >
            {notificationCount}
          </Badge>
        )}
      </MenuButton>

      <MenuList>
        {notificationCount > 0 ? (
          notificaciones.map((notificacion) => (
            <MenuItem
              key={notificacion.id}
              display="flex"
              justifyContent="space-between"
              color="black"
              opacity={notificacion.leida ? 0.6 : 1}
            >
              {notificacion.mensaje}
              <HStack spacing={2}>
                {notificacion.factura_id ? (
                  <IconButton
                    aria-label="Ver factura"
                    icon={<Eye size={16} />}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => navigate(`/factura/${notificacion.factura_id}`)}
                  />
                ) : (
                  <IconButton
                    aria-label="Ir a liquidacion"
                    icon={<ArrowRight size={16} />}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => navigate("/calcular-totales")}
                  />
                )}
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
          <MenuItem color="black" isDisabled>
            No hay notificaciones
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default MenuNotificaciones;
