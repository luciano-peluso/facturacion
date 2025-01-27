import React from "react";
import { Box, Flex, Spacer, Heading, HStack } from "@chakra-ui/react";
import MenuHamburguesa from "./menuHamburguesa";
import MenuNotificaciones from "./MenuNotificaciones"
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      p={4}
      bg="pink.300"
      color="white"
    >
      <Heading size="md">Factureitor</Heading>
      <Spacer />
      <HStack>
      <MenuNotificaciones />
      <MenuHamburguesa onNavigate={(path) => navigate(path)} />
      </HStack>
    </Flex>
  );
};

export default Header;