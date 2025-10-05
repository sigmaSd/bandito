import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req) {
    const env = new URL(req.url).searchParams.entries().next().value?.at(0);
    if (!env) {
      return new Response("Invalid environment variable", { status: 400 });
    }
    return new Response(Deno.env.get(env));
  },
};
