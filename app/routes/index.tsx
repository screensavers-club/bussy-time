import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";
import { Container, VStack, Button, Box } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

interface BusStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
}

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = () => {
  // https://remix.run/api/remix#json
  return json({});
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Bussy Time",
    description: "A simple bus time loader",
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let [nearbyStops, setNearbyStops] = useState<BusStop[]>([]);

  function getNearby() {
    navigator.geolocation.getCurrentPosition((position) => {
      const { longitude, latitude } = position.coords;
      axios.get(`/nearby/${longitude},${latitude}`).then(({ data }) => {
        setNearbyStops(data);
      });
    });
  }

  return (
    <Container>
      <VStack width="100%">
        <VStack width="100%">
          {nearbyStops.length > 0 &&
            nearbyStops.map((stop) => (
              <Button
                key={stop.BusStopCode}
                variant="ghost"
                width="100%"
                border="1px"
                padding={8}
                borderColor="gray.300"
                onClick={() => {
                  window.location.href = `/stop/${stop.BusStopCode}`;
                }}
              >
                {stop.Description}
              </Button>
            ))}
        </VStack>
        <Box>
          <Button onClick={getNearby} leftIcon={<>🤞</>}>
            Get Nearby Stops
          </Button>
        </Box>
      </VStack>
    </Container>
  );
}
