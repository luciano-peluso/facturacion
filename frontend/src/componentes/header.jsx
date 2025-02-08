import React from "react";
import { Flex, Spacer, HStack, Text } from "@chakra-ui/react";
import MenuHamburguesa from "./menuHamburguesa";
import MenuNotificaciones from "./MenuNotificaciones";
import { useNavigate } from "react-router-dom";

const Header = ({ mensaje }) => { // Aquí se cambia `mensaje` a una prop
  const navigate = useNavigate();

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      p={5}
      color="white"
      maxW={"100%"}
      mb={5}
    >
      <Text color={"grey"}>{mensaje}</Text>
      <Spacer />
      <HStack>
        <MenuNotificaciones />
        <MenuHamburguesa onNavigate={(path) => navigate(path)} />
      </HStack>
    </Flex>
  );
};

export default Header;
