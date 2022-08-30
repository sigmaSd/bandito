import { Handlers } from "$fresh/server.ts";
import { ElTrafico } from "../../eltrafico/eltrafico.ts";

// start eltrafico when the server starts
const eltrafico = new ElTrafico();
const userInterface = Deno.args[0];
if (!userInterface) {
  console.error("Please specify an interface, example `bandit wlan0`");
  Deno.exit(1);
}
await eltrafico.interface(userInterface);

const polledApps: { name: string }[] = [];
const pollForEver = async () => {
  while (true) {
    const data = await eltrafico.poll();
    if (Object.hasOwn(data, "stop")) {
      //FIXME
    } else {
      for (const app of data as { name: string }[]) {
        if (!polledApps.includes(app)) {
          polledApps.push(app);
        }
      }
    }
  }
};
pollForEver();

export const handler: Handlers = {
  async POST(req) {
    const message = await req.json();
    switch (message.method) {
      case "interface":
        await eltrafico.interface(message.interface);
        break;
      case "limit":
        await eltrafico.limit(message.app);
        break;
      case "poll":
        return new Response(JSON.stringify(polledApps));
      case "stop":
        await eltrafico.stop();
        break;
      default:
        console.error("Unkown method: ", message.method);
    }
    return new Response();
  },
};
