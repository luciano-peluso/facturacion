import { FormControl, FormLabel, Input } from "@chakra-ui/react";

const NumberInputComponent = ({ label, name, value, onChange, placeholder, isRequired}) => {
    return (
        <FormControl isRequired={isRequired}>
            <FormLabel>{label}</FormLabel>
            <Input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            />
        </FormControl>
    );
}

export default NumberInputComponent;