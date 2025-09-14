import { FormControl, FormLabel, Select } from "@chakra-ui/react";

const PacienteSelect = ({ pacientes, value, onChange}) => {
    return (
        <FormControl isRequired>
            <FormLabel>Paciente</FormLabel>
            <Select
                placeholder="Selecciona un paciente"
                name="paciente_id"
                value={value}
                onChange={onChange}
                >
                    {pacientes.map((paciente) => (
                        <option key={paciente.id} value={paciente.id}>
                            {paciente.nombre}
                        </option>
                    ))}
            </Select>
        </FormControl>
    );
};

export default PacienteSelect;