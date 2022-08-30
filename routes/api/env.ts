import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req) {
    const env = new URL(req.url).searchParams.entries().next().value[0]
    return new Response(Deno.env.get(env));
  },
};
