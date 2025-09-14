import { useEffect, useState } from "react";
import axios from "axios";

export const useObrasSocialesPaciente = (pacienteId) => {
    const [obras, setObras] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const traerObras = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/pacienteobrasocial/'+pacienteId);
            console.log("Obras sociales del paciente:", res.data.data);
            setObras(res.data.data);
            setError(null);
        } catch (error) {
            console.error("Error al traer las obras sociales del paciente: ", error);
            setError(error);
        } finally {
            setLoading(false);
        }   
    };
    
    useEffect(() => {
        if(!pacienteId) {
            setObras([]);
            return;
        }
        setLoading(true);
        
        traerObras();
    }, [pacienteId]);   

    return {obras, loading, error};
};