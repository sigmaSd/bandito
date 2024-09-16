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
      const global = newApps.length === 0
        ? {
          name: "[INTERNAL]GLOBAL",
          downloadRate: 0,
          uploadRate: 0,
        }
        : newApps.reduce((app, acc) => {
          return {
            name: "[INTERNAL]GLOBAL",
            downloadRate: acc.downloadRate + app.downloadRate,
            uploadRate: acc.uploadRate + app.uploadRate,
          };
        });
      // round to 2 decimals
      global.downloadRate = Math.round(global.downloadRate * 100) / 100;
      global.uploadRate = Math.round(global.uploadRate * 100) / 100;

      return new Response(JSON.stringify([global, ...newApps]));
    } else {
      return new Response(JSON.stringify({}));
    }
  },
};
