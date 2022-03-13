import { Button, Container, VStack, Text, Heading } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import type { MetaFunction } from "remix";

export let meta: MetaFunction = () => {
  return {
    title: "Fav Stops | Busket",
    description: "Why my bus haven't come",
  };
};

export default function FavList() {
  let [stops, setStops] = useState<BusStop[]>([]);

  useEffect(() => {
    let favs = JSON.parse(
      localStorage.getItem("fav-stops") || "[]"
    ) as LocalStorageFavStop[];

    Promise.all(favs.map((fav) => axios.get(`/stop/info/${fav.busstop}`))).then(
      (result) => {
        setStops(result.map(({ data }) => data));
      }
    );
  }, []);

  return (
    <Container padding={2} paddingTop={"80px"}>
      <VStack width="100%">
        <VStack width="100%">
          <Heading as="h3" size="md">
            Favourites
          </Heading>
          {stops.length > 0 &&
            stops.map((stop) => (
              <Button
                key={stop.BusStopCode}
                variant="ghost"
                width="100%"
                border="1px"
                padding={8}
                flexDirection="column"
                borderColor="gray.300"
                onClick={() => {
                  window.location.href = `/stop/${stop.BusStopCode}`;
                }}
              >
                <Text>{stop.Description}</Text>
                <Text color="gray.500" fontWeight={"light"}>
                  {stop.RoadName}
                </Text>
              </Button>
            ))}
        </VStack>
      </VStack>
    </Container>
  );
}
