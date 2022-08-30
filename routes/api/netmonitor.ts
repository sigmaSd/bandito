import { Handlers } from "$fresh/server.ts";
import { bandwhich } from "../../netmonitor/bandwhich.ts";

// start net monitoring when the server starts
const netState = bandwhich();
let polledApps: { name: string; downloadRate: number; uploadRate: number }[] =
  [];

export const handler: Handlers = {
  async GET() {
    const currentState = await netState.next();
    if (!currentState.done) {
      const newApps = currentState.value;
      // keep old elements
      for (const app of polledApps) {
        if (!newApps.find((napp) => napp.name === app.name)) {
          newApps.push(app);
        }
      }
      polledApps = [...newApps];
      return new Response(JSON.stringify(polledApps));
    } else {
      return new Response(JSON.stringify({}));
    }
  },
};
