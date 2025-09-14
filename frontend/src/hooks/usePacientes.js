import { useEffect, useState } from "react";
import axios from "axios";

export const usePacientes = () => {
    const [pacientes, setPacientes] = useState([]);
    
    useEffect(() => {
        const traerPacientes = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/pacientes");
                if (!response) {
                    console.error("Error en la respuesta al traer los pacientes:", error);
                }
                if(response.data.data.length === 0) {
                    setPacientes([]);
                    console.error("No se encontraron pacientes.");
                } else {
                    setPacientes(response.data.data);
                }
            } catch (error) {
                    console.error("Error al traer los pacientes:", error);
            }
        };    
        traerPacientes();
    }, []);
    
    return pacientes;
};