import { Button, Container, Stack, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export default function NearbyList() {
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
    <Container padding={2} paddingTop={"80px"}>
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
        <Stack direction={"column"}>
          <Button onClick={getNearby} leftIcon={<>🤞</>}>
            Get Nearby Stops
          </Button>

          <Button onClick={() => {}} leftIcon={<>❤️</>}>
            Favourites
          </Button>
        </Stack>
      </VStack>
    </Container>
  );
}
