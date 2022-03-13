import { Box } from "@chakra-ui/react";
import { MetaFunction, Outlet } from "remix";
import BusstopInput from "../components/busstop-input";

export let meta: MetaFunction = () => {
  return {
    title: "Busket",
    description: "Why my bus haven't come",
  };
};

export default function StopIndex() {
  return (
    <>
      <BusstopInput />
      <Outlet />
    </>
  );
}
