import axios from "axios";
import { json } from "@remix-run/server-runtime";
import { createClient } from "redis";

interface BusStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
}

export function loader({}) {
  const client = createClient({ url: process.env.REDIS_URL });

  const promiseChain: (n?: number, accum?: BusStop[]) => Promise<BusStop[]> = (
    n = 0,
    accum = []
  ) => {
    const busStopEndpoint = `http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${
      n * 500
    }`;

    return axios
      .get(busStopEndpoint, {
        headers: {
          AccountKey: process.env.DATAMALL_API_KEY || "",
          accept: "application/json",
        },
      })
      .then((response) => {
        if (response.data.value.length > 0) {
          return promiseChain(n + 1, accum.concat(response.data.value));
        } else {
          return Promise.resolve(accum);
        }
      });
  };

  client.on("error", (err) => {
    return json({ err });
  });

  return client
    .connect()

    .then(() => {
      return promiseChain();
    })

    .then((stops) => {
      // add stops to hash set "stops"
      return Promise.all(
        stops.map((stop) => {
          return client.hSet("stops", stop.BusStopCode, JSON.stringify(stop));
        })
      ).then(() => {
        return stops;
      });
    })

    .then((stops) => {
      // add stops to hash set "stops"
      return Promise.all(
        stops.map((stop) => {
          return client.geoAdd("STOPSGEO", {
            latitude: stop.Latitude,
            longitude: stop.Longitude,
            member: stop.BusStopCode,
          });
        })
      );
    })

    .then(() => {
      return json({ ok: true });
    });
}
