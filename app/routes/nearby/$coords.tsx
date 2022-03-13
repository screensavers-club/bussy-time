import { json } from "@remix-run/server-runtime";
import { createClient } from "redis";
import { getDistance, isPointWithinRadius } from "geolib";

export function loader({ params }: { params: { coords: string } }) {
  const client = createClient({ url: process.env.REDIS_URL });
  const [long, lat] = params.coords.split(",");

  if (!long || !lat) {
    return json({ error: "Provide both long and lat" });
  }

  client.on("error", (err) => {
    return json({ err });
  });

  return client
    .connect()

    .then(() => {
      return client.hGetAll("stops");
    })

    .then((stops) => {
      return Object.values(stops)
        .map((stop) => {
          return {
            ...JSON.parse(stop || "{}"),
          };
        })
        .map((point) => {
          return {
            ...point,
            distance: getDistance(
              { latitude: parseFloat(lat), longitude: parseFloat(long) },
              { latitude: point.Latitude, longitude: point.Longitude }
            ),
          };
        })
        .sort((a, b) => a.distance - b.distance)
        .filter((point) => {
          return isPointWithinRadius(
            { latitude: parseFloat(lat), longitude: parseFloat(long) },
            { latitude: point.Latitude, longitude: point.Longitude },
            400
          );
        });
    })

    .then((result) => {
      return result;
    });
}
