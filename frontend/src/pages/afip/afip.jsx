import { Button } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../componentes/sidebar";

const afip = () => {
    const navigate = useNavigate();
    return(<>
        <h1>Paciencia! Estamos bajo construccion 👷‍♂️</h1>
        <Button onClick={() => navigate('/')}>Volver</Button>
        </>)
};

export default afip;