import { Box } from "@chakra-ui/react";
import { MetaFunction, Outlet } from "remix";
import BusstopInput from "../components/busstop-input";

export let meta: MetaFunction = () => {
  return {
    title: "Bussy Time",
    description: "A simple bus time loader",
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
