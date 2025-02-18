import React from "react";
import { Flex, Spacer, HStack, Text, Heading } from "@chakra-ui/react";
import MenuHamburguesa from "./menuHamburguesa";
import MenuNotificaciones from "./MenuNotificaciones";
import { useNavigate } from "react-router-dom";

const Header = ({ mensaje, titulo }) => {
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
      <Heading size={"lg"} color={"black"}>{titulo}</Heading>
      <Spacer />
      <MenuNotificaciones />
        {/* <MenuHamburguesa onNavigate={(path) => navigate(path)} /> */}
    </Flex>
  );
};

export default Header;
