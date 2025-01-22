import React from "react";
import { Box, Flex, Spacer, Heading } from "@chakra-ui/react";
import MenuHamburguesa from "./menuHamburguesa";
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
      <MenuHamburguesa onNavigate={(path) => navigate(path)} />
    </Flex>
  );
};

export default Header;