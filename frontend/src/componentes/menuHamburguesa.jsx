import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    VStack,
    Divider,
  } from "@chakra-ui/react";
  import { HamburgerIcon } from "@chakra-ui/icons";
  import { useDisclosure } from "@chakra-ui/react";
  
  const HamburguesaDrawer = ({ onNavigate }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    return (
      <>
        {/* Botón para abrir el Drawer */}
        <Button
          onClick={onOpen}
          variant="outline"
          bg="white"
          _hover={{ bg: "pink.200" }}
          size="md"
        >
          <HamburgerIcon />
        </Button>
  
        {/* Drawer */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg="white">
            <DrawerCloseButton _hover={{ bg: "pink.200" }} />
            <DrawerHeader color="black" fontWeight="bold">
              Menú
            </DrawerHeader>
  
            <DrawerBody>
              <VStack spacing={4} align="stretch">
                <Button
                  variant="solid"
                  colorScheme="gray"
                  color="black"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  _hover={{ bg: "pink.200" }}
                  onClick={() => {
                    onNavigate("/");
                    onClose();
                  }}
                >
                  Inicio
                </Button>
  
                {/* Sección Facturas */}
                <Divider />
                <DrawerHeader fontSize="md" color="black" pl={0}>
                  Facturas
                </DrawerHeader>
                <Button
                  variant="solid"
                  colorScheme="gray"
                  color="black"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  _hover={{ bg: "pink.200" }}
                  onClick={() => {
                    onNavigate("/crear-facturas");
                    onClose();
                  }}
                >
                  Crear facturas
                </Button>
                <Button
                  variant="solid"
                  colorScheme="gray"
                  color="black"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  _hover={{ bg: "pink.200" }}
                  onClick={() => {
                    onNavigate("/facturas");
                    onClose();
                  }}
                >
                  Ver Facturas
                </Button>
                <Button
                  variant="solid"
                  colorScheme="gray"
                  color="black"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  _hover={{ bg: "pink.200" }}
                  onClick={() => {
                    onNavigate("/facturas-accordion");
                    onClose();
                  }}
                >
                  Ver Facturas estilo Accordion
                </Button>
                <Button
                  variant="solid"
                  colorScheme="gray"
                  color="black"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  _hover={{ bg: "pink.200" }}
                  onClick={() => {
                    onNavigate("/facturas-filtro");
                    onClose();
                  }}
                >
                  Ver Facturas con Filtros
                </Button>
  
                <Divider />
                <Button
                  variant="solid"
                  colorScheme="gray"
                  color="black"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  _hover={{ bg: "pink.200" }}
                  onClick={() => {
                    onNavigate("/configuracion");
                    onClose();
                  }}
                >
                  Configuración
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  };
  
  export default HamburguesaDrawer;