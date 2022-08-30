import { TextDelimiterStream } from "https://deno.land/std@0.141.0/streams/delimiter.ts";

export async function* bandwhich() {
  const bandwhichStream = Deno.spawnChild("pkexec", {
    args: ["bandwhich", "-p", "--raw"],
    stdout: "piped",
  }).stdout.pipeThrough(new TextDecoderStream()).pipeThrough(
    new TextDelimiterStream("\n\n"),
  );

  for await (const data of bandwhichStream) {
    yield parse(data);
  }
}

function parse(data: string) {
  return data.split("\n").slice(1).map((line) => {
    if (line === "<NO TRAFFIC>") {
      return;
    }
    const lineParts = line.split(/\s+/);

    const name = lineParts[2].slice(1, -1);
    const netRate = lineParts[5];

    const uploadRate = parseFloat(netRate.split("/")[0]) / 1000;
    const downloadRate = parseFloat(netRate.split("/")[1]) / 1000;
    return {
      name,
      downloadRate,
      uploadRate,
    };
  }).filter((e) => e) as {
    name: string;
    downloadRate: number;
    uploadRate: number;
  }[];
}
