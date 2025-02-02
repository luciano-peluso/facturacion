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
                    onNavigate("/ver-facturas");
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
                    onNavigate("/calcular-totales");
                    onClose();
                  }}
                >
                  Ver totales comision
                </Button>
                <Divider />
                <DrawerHeader fontSize="md" color="black" pl={0}>
                  Pacientes
                </DrawerHeader>
                { /* Divide la seccion a la de obras sociales */ }
                <Button
                  variant="solid"
                  colorScheme="gray"
                  color="black"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  _hover={{ bg: "pink.200" }}
                  onClick={() => {
                    onNavigate("/crear-pacientes");
                    onClose();
                  }}
                >
                  Crear Paciente
                </Button>
                <Button
                  variant="solid"
                  colorScheme="gray"
                  color="black"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  _hover={{ bg: "pink.200" }}
                  onClick={() => {
                    onNavigate("/ver-pacientes");
                    onClose();
                  }}
                >
                  Ver Pacientes
                </Button>
                {/* <Button
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
   */}
                <Divider />
                <DrawerHeader fontSize="md" color="black" pl={0}>
                  Obras Sociales
                </DrawerHeader>
                { /* Divide la seccion a la de obras sociales */ }
                <Button
                  variant="solid"
                  colorScheme="gray"
                  color="black"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  _hover={{ bg: "pink.200" }}
                  onClick={() => {
                    onNavigate("/crear-obras-sociales");
                    onClose();
                  }}
                >
                  Crear Obras Sociales
                </Button>
                <Button
                  variant="solid"
                  colorScheme="gray"
                  color="black"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  _hover={{ bg: "pink.200" }}
                  onClick={() => {
                    onNavigate("/ver-obras-sociales");
                    onClose();
                  }}
                >
                  Ver Obras Sociales
                </Button>
                <Divider />
                <DrawerHeader fontSize="md" color="black" pl={0}>
                  Tutores
                </DrawerHeader>
                { /* Divide la seccion a la de tutores */ }
                <Button
                  variant="solid"
                  colorScheme="gray"
                  color="black"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  _hover={{ bg: "pink.200" }}
                  onClick={() => {
                    onNavigate("/crear-tutores");
                    onClose();
                  }}
                >
                  Crear Tutores
                </Button>
                <Button
                  variant="solid"
                  colorScheme="gray"
                  color="black"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  _hover={{ bg: "pink.200" }}
                  onClick={() => {
                    onNavigate("/ver-tutores");
                    onClose();
                  }}
                >
                  Ver Tutores
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