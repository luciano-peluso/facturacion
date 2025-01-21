import React from "react";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const MenuHamburguesa = ({ onNavigate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<HamburgerIcon />}
        variant="outline"
        aria-label="Menu"
        bg="white"
        _hover={{ bg: "pink.200" }}
      />
      <MenuList bg="pink.100" color="black" border="none" shadow="md">
        <MenuItem
          _hover={{ bg: "pink.200" }}
          onClick={() => onNavigate("/")}
        >
          Inicio
        </MenuItem>
        <MenuItem
          _hover={{ bg: "pink.200" }}
          onClick={() => onNavigate("/facturas")}
        >
          Facturas
        </MenuItem>
        <MenuItem
          _hover={{ bg: "pink.200" }}
          onClick={() => onNavigate("/facturas-accordion")}
        >
          Facturas Accordion
        </MenuItem>
        <MenuItem
          _hover={{ bg: "pink.200" }}
          onClick={() => onNavigate("/facturas-filtro")}
        >
          Facturas filtro
        </MenuItem>
        <MenuItem
          _hover={{ bg: "pink.200" }}
          onClick={() => onNavigate("/configuracion")}
        >
          Configuración
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default MenuHamburguesa;