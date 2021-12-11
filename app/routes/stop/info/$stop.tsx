import { json } from "@remix-run/server-runtime";
import { createClient } from "redis";

export function loader({ params }) {
  const { stop } = params;
  console.log(stop);

  const client = createClient({ url: process.env.REDIS_URL });

  return client.connect().then(() => {
    return client.hGet("stops", stop).then((r) => JSON.parse(r || "{}"));
  });
}
