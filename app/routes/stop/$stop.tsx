import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";

import {
  Container,
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

interface BusArrivalResponseData {
  "odata.metadata": string;
  BusStopCode: string;
  Services: BusArrivalService[];
}

interface BusArrivalService {
  ServiceNo: string;
  Operator: string;
  NextBus: BusArrivalNextBus;
  NextBus2: BusArrivalNextBus;
  NextBus3: BusArrivalNextBus;
}

interface BusArrivalNextBus {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: string;
  Feature: string;
  Type: string;
}

interface BusArrivalError {
  err: any;
}

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

export let meta: MetaFunction = () => {
  return {
    title: "Bussy Time",
    description: "A simple bus time loader",
  };
};

export default function PageStop() {
  const data = useLoaderData();
  const [busstop, setBusstop] = useState<{ Description?: string }>({});
  const [sort, setSort] = useState<BusStopSort>("bus");

  useEffect(() => {
    if (!data.BusStopCode) {
      return;
    }
    axios.get(`/stop/info/${data.BusStopCode}`).then(({ data }) => {
      setBusstop(data);
    });
  }, []);

  if ((data as BusArrivalError).err) {
    return <Container>An error has occurred</Container>;
  }

  const busArrivalData = data as BusArrivalResponseData;

  return (
    <Container padding={2} paddingTop={"80px"}>
      <VStack>
        <Flex justifyContent="space-between" width="100%" alignItems="start">
          <Box>
            <Heading size="2xl" color="gray.700">
              {busArrivalData.BusStopCode}{" "}
            </Heading>

            <Heading size="md" color="gray.400">
              {busstop?.Description?.toUpperCase() || ""}
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
          css={css`
            background: #fff;
          `}
          boxShadow="sm"
          mr={2}
        >
          {sort === "bus" ? "🚌" : "⏲️"}
        </Button>
        <Button
          boxShadow="sm"
          onClick={() => window.location.reload()}
          css={css`
            background: #f5a623;
            color: white;
          `}
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
