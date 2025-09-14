import { FormControl, FormLabel, Input } from "@chakra-ui/react";

const FechaComponent = ({ label, name, value, onChange, isRequired = false }) => {
  return (
    <FormControl isRequired={isRequired}>
        <FormLabel>{label}</FormLabel>
        <Input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        />
    </FormControl>
  );
}

export default FechaComponent;