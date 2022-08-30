import { Handlers } from "$fresh/server.ts";

const ifconfig = async () => {
  const rawData = await Deno.readTextFile("/proc/net/dev");

  //TODO: actually parse interface status
  return rawData
    .split("\n")
    .slice(2)
    .filter((line) => line)
    .map((line) => {
      return {
        name: line.split(":")[0],
      };
    });
};

export const handler: Handlers = {
  async GET() {
    return new Response(JSON.stringify(await ifconfig()));
  },
};
