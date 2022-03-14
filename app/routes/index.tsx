import { Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { MetaFunction } from "remix";

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Busket",
    description: "Why my bus haven't come",
  };
};

export default function Index() {
  useEffect(() => {
    window.location.href = "/stop/nearby";
  }, []);
  return (
    <Flex justify={"center"} py={8}>
      <Text fontSize="8xl">🚌</Text>
    </Flex>
  );
}
