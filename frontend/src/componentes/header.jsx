import React from "react";
import { Box, Flex, Spacer, Heading, HStack, Button, Text } from "@chakra-ui/react";
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
      <Text 
       ml={5}
        fontSize="xl"
        fontWeight="bold"
        cursor="pointer"
        _hover={{
          color: "white",
          transform: "scale(1.05)",
          transition: "0.1s ease-in-out"
        }}
        onClick={() => navigate("/")}
      >
        Factureitor
      </Text>
      <Spacer />
      <HStack>
      <MenuNotificaciones />
      <MenuHamburguesa onNavigate={(path) => navigate(path)} />
      </HStack>
    </Flex>
  );
};

export default Header;