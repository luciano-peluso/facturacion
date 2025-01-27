import { BellIcon } from "@chakra-ui/icons";
import { Badge, Button, IconButton } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";


const MenuNotificaciones = () => {
    const [notificationCount, setNotificacionCount] = useState([]);

    useEffect(() => {
        setNotificacionCount(4);
    },[])
    return (<>
        <Button
            variant="outline"
            bg="white"
            _hover={{ bg: "pink.200" }}
            size="md"
            >
            <BellIcon />
            {notificationCount > 0 && (
                  <Badge
                    colorScheme="red"
                    borderRadius="full"
                    fontSize="0.8em"
                    ml={-2}
                    mt={-3}
                  >
                    {notificationCount}
                  </Badge>
                )}
        </Button>
    </>
)}

export default MenuNotificaciones;