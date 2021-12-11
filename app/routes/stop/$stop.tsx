import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";

import {
  Container,
  VStack,
  Flex,
  Heading,
  Divider,
  Box,
  Button,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";

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

export default function Index() {
  const data = useLoaderData();
  const [busstop, setBusstop] = useState<{ Description?: string }>({});

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
    <Container padding={0}>
      <VStack>
        <Flex justifyContent="space-between" width="100%" alignItems="start">
          <Box>
            <Heading size="2xl" color="gray.500">
              {busArrivalData.BusStopCode}{" "}
            </Heading>

            <Heading size="md" color="gray.700">
              {busstop.Description || ""}
            </Heading>
          </Box>

          <Button
            fontSize="xl"
            variant="ghost"
            color="gray.400"
            rightIcon={<RepeatIcon />}
            onClick={() => {
              window && window.location.reload();
            }}
          ></Button>
        </Flex>
        {busArrivalData.Services.sort(
          (a, b) => parseInt(a.ServiceNo) - parseInt(b.ServiceNo)
        ).map((service) => {
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
