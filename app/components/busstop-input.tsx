import {
  Flex,
  InputGroup,
  NumberInput,
  NumberInputField,
  Button,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BusstopInput() {
  const [busNumberInput, setBusNumberInput] = useState<number | string>("");
  const navigate = useNavigate();

  return (
    <Flex
      as="header"
      position="fixed"
      w="100%"
      top="0"
      zIndex="200"
      backgroundColor="#fff"
      padding={2}
      boxSizing="border-box"
      boxShadow="lg"
    >
      <InputGroup size="lg">
        <Button
          fontSize="xl"
          onClick={() => {
            navigate(`/stop/nearby`);
          }}
        >
          🚌
        </Button>
        <NumberInput width="100%" ml={2}>
          <NumberInputField
            placeholder="Enter bus stop number"
            value={busNumberInput?.toString()}
            onChange={(e) => {
              setBusNumberInput(e.target.value);
            }}
            onBlur={(e) => {
              setBusNumberInput(parseInt(e.target.value) || "");
            }}
            autoFocus
            borderRightRadius={0}
          />
        </NumberInput>

        <Button
          ml={0}
          disabled={!busNumberInput}
          borderLeftRadius={0}
          onClick={() => {
            if (busNumberInput) {
              navigate(`/stop/${busNumberInput}`);
            }
          }}
        >
          Go
        </Button>
      </InputGroup>
    </Flex>
  );
}
