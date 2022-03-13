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
    <>
      <h1>Redirecting...</h1>
    </>
  );
}
