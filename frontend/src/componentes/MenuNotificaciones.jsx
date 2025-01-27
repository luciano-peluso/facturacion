import { BellIcon } from "@chakra-ui/icons";
import { Badge, Button, IconButton } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";


const MenuNotificaciones = () => {
    const [notificationCount, setNotificacionCount] = useState([]);

    const traerNotificaciones = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/notificaciones');
        setNotificacionCount(response.data.data.length);
      } catch (error) {
        console.error("No se pudo traer las notificaciones", error);
      }
    }

    useEffect(() => {
        traerNotificaciones();
    },[])
    return (<>
        <Button
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
      </Button>
    </>
)}

export default MenuNotificaciones;