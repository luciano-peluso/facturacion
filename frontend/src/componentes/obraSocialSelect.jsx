import { FormControl, FormLabel, Select, Spinner } from "@chakra-ui/react";
import { useObrasSocialesPaciente } from "../hooks/useObrasSocialesPaciente";

const ObraSocialSelect = ({ paciente_id, value, onChange }) => {
  const {obrasSociales, loading, error} = useObrasSocialesPaciente(paciente_id);
  return (
    <FormControl isRequired>
      <FormLabel>Obra Social</FormLabel>
      {loading && <Spinner size="sm" />}
      {error && <Text color="red.500">Error al cargar obras sociales</Text>}

      <Select
        placeholder="Selecciona una obra social"
        name="paciente_obra_social_id"
        value={value}
        onChange={onChange}
      >
        {obrasSociales?.length === 0 ? (
          <option value="">No hay obras sociales</option>
        ) : (
          obrasSociales?.map((unaObraSocial) => (
            <option key={unaObraSocial.id} value={unaObraSocial.id}>
              {unaObraSocial.id}
            </option>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default ObraSocialSelect;