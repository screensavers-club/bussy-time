import { Text, Button, Container, Stack, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "remix";
import type { MetaFunction } from "remix";

export let meta: MetaFunction = () => {
  return {
    title: "Nearby Stops | Busket",
    description: "Why my bus haven't come",
  };
};

export default function NearbyList() {
  const [nearbyStops, setNearbyStops] = useState<BusStop[]>([]);
  const [loadingNearby, setLoadingNearby] = useState<boolean>(false);
  const navigate = useNavigate();

  function getNearby() {
    setLoadingNearby(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const { longitude, latitude } = position.coords;
      axios.get(`/nearby/${longitude},${latitude}`).then(({ data }) => {
        setNearbyStops(data);
        setLoadingNearby(false);
      });
    });
  }
  return (
    <Container padding={2} paddingTop={"80px"}>
      <VStack width="100%">
        <Stack direction={"row"}>
          <Button onClick={getNearby} leftIcon={<>🤞</>}>
            Nearby
          </Button>

          <Button
            onClick={() => {
              navigate(`/stop/fav`);
            }}
            leftIcon={<>❤️</>}
          >
            Favourites
          </Button>
        </Stack>

        <VStack width="100%">
          {loadingNearby && "loading..."}
          {nearbyStops.length > 0 &&
            nearbyStops.map((stop) => (
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
