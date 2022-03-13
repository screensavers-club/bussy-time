import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";

import {
  Container,
  Stack,
  VStack,
  Flex,
  Heading,
  Divider,
  Box,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { css } from "@emotion/react";

export let loader: LoaderFunction = ({ params }) => {
  const arrivalEndpoint = `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${params.stop}`;

  return axios
    .get(arrivalEndpoint, {
      headers: {
        AccountKey: process.env.DATAMALL_API_KEY || "",
        accept: "application/json",
      },
    })

    .then(({ data }) => {
      return json(data);
    })
    .catch((err) => {
      return json({ err });
    });
};

export let meta: MetaFunction = ({ params }) => {
  return {
    title: `${params.stop} | Busket`,
    description: "Why my bus haven't come",
  };
};

export default function PageStop() {
  const data = useLoaderData();
  const [busstop, setBusstop] = useState<BusStop>();
  const [sort, setSort] = useState<BusStopSort>("bus");
  const [isFav, setIsFav] = useState<boolean>(false);

  useEffect(() => {
    if (!data.BusStopCode) {
      return;
    }
    axios.get(`/stop/info/${data.BusStopCode}`).then(({ data }) => {
      setBusstop(data);
    });

    const favStops = JSON.parse(
      localStorage.getItem("fav-stops") || "[]"
    ) as LocalStorageFavStop[];
    const storedFav =
      favStops.findIndex((s) => s.busstop === data.BusStopCode) > -1;
    setIsFav(storedFav);

    const storedSort = JSON.parse(
      localStorage.getItem("sort-by-bus") || "false"
    ) as boolean;
    setSort(storedSort ? "bus" : "time");
  }, []);

  useEffect(() => {
    const favStops = JSON.parse(
      localStorage.getItem("fav-stops") || "[]"
    ) as LocalStorageFavStop[];

    const storedFav =
      favStops.findIndex((s) => s.busstop === data.BusStopCode) > -1;

    if (isFav) {
      if (!storedFav) {
        localStorage.setItem(
          "fav-stops",
          JSON.stringify([
            ...favStops,
            { busstop: data.BusStopCode } as LocalStorageFavStop,
          ])
        );
      }
    } else {
      if (storedFav) {
        localStorage.setItem(
          "fav-stops",
          JSON.stringify(favStops.filter((s) => s.busstop !== data.BusStopCode))
        );
      }
    }
  }, [isFav]);

  useEffect(() => {
    localStorage.setItem("sort-by-bus", JSON.stringify(sort === "bus"));
  }, [sort]);

  if ((data as BusArrivalError).err) {
    return <Container>An error has occurred</Container>;
  }

  const busArrivalData = data as BusArrivalResponseData;

  return (
    <Container padding={2} paddingTop={"80px"}>
      <VStack>
        <Flex
          justifyContent="space-between"
          width="100%"
          alignItems="start"
          position="sticky"
          top="60px"
          pb="20px"
          backgroundColor={"white"}
          zIndex={3}
          borderBottomWidth={1}
        >
          <Box mt={4} width="100%">
            <Stack
              width={`100%`}
              direction="row"
              align="center"
              justifyContent={"flex-start"}
            >
              <Heading
                size="2xl"
                color="gray.600"
                as="h1"
                letterSpacing={"-0.02em"}
              >
                {busArrivalData.BusStopCode}{" "}
              </Heading>
              <Button
                background="transparent"
                fontSize="2xl"
                onClick={() => {
                  setIsFav(!isFav);
                }}
                px={0}
              >
                {isFav ? "🌟" : "⭐"}
              </Button>
            </Stack>

            <Heading
              size="sm"
              letterSpacing={"-0.02em"}
              fontWeight={500}
              color={busstop?.Description ? "gray.500" : "white"}
              css={css`
                transition: color ease 0.3s;
              `}
            >
              {busstop?.Description?.toUpperCase() || "loading"}
              <br />
              {busstop?.RoadName || "loading"}
            </Heading>
          </Box>
        </Flex>
        {busArrivalData.Services.sort((a, b) => {
          if (sort === "bus") {
            return parseInt(a.ServiceNo) - parseInt(b.ServiceNo);
          } else {
            return (
              new Date(a.NextBus.EstimatedArrival).getTime() -
              new Date(b.NextBus.EstimatedArrival).getTime()
            );
          }
        }).map((service) => {
          return (
            <Flex
              key={service.ServiceNo}
              justifyContent="start"
              width="100%"
              height={24}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              mb={2}
              alignItems="center"
              backgroundColor="gray.50"
            >
              <Heading
                as="h2"
                size="xl"
                width={24}
                textAlign="center"
                color="gray.600"
              >
                {service.ServiceNo}
              </Heading>
              <Divider orientation="vertical" />
              <Flex grow={1}>
                <TimeDisplay
                  width="33.3%"
                  est={new Date(service.NextBus.EstimatedArrival)}
                />
                <Divider orientation="vertical" />
                <TimeDisplay
                  width="33.3%"
                  est={new Date(service.NextBus2.EstimatedArrival)}
                />
                <Divider orientation="vertical" />
                <TimeDisplay
                  width="33.3%"
                  est={new Date(service.NextBus3.EstimatedArrival)}
                />
              </Flex>
            </Flex>
          );
        })}
      </VStack>
      <Box
        css={css`
          position: fixed;
          right: 10px;
          bottom: 10px;
        `}
      >
        <Button
          onClick={() => {
            setSort(sort === "bus" ? "time" : "bus");
          }}
          fontSize="3xl"
          mr={2}
          borderWidth={1}
          borderColor="gray.300"
        >
          {sort === "bus" ? "🔢" : "🕙️"}
        </Button>
        <Button
          fontSize="3xl"
          onClick={() => window.location.reload()}
          borderWidth={1}
          borderColor="gray.300"
        >
          🔄
        </Button>
      </Box>
    </Container>
  );
}

function TimeDisplay({ est, width }: { est: Date; width: string }) {
  const t = Math.ceil((est.getTime() - new Date().getTime()) / 1000 / 60);
  const tt = isNaN(t) ? "n/a" : t < 1 ? "<1" : t;
  return (
    <VStack width={width}>
      <Heading as="h3" size="md" color={t < 1 ? "green.500" : "gray.600"}>
        {tt}
      </Heading>
      <span>min</span>
    </VStack>
  );
}
