import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { ActionFunction, MetaFunction } from "remix";
import { redirect } from "remix";

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Bussy Time",
    description: "A simple bus time loader",
  };
};

export default function Index() {
  useEffect(() => {
    window.location.href = "/stop/nearby";
  }, []);
  return (
    <>
      <h1>Redirecting...</h1>
    </>
  );
}
