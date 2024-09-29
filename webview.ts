import { Webview } from "jsr:@webview/webview@0.8.0";

const worker = new Worker(new URL("./main.ts", import.meta.url), {
  type: "module",
});

const webview = new Webview();
webview.title = "Bandito";
webview.navigate("http://localhost:8000");

webview.run();
await fetch("http://localhost:8000/api/eltrafico", {
  method: "POST",
  body: JSON.stringify({
    method: "stop",
  }),
});
while (true) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1000);

  try {
    const resp = await fetch("http://localhost:8000/api/eltrafico", {
      method: "POST",
      body: JSON.stringify({
        method: "poll",
      }),
      signal: controller.signal,
    }).then((res) => res.json());
    clearTimeout(timeoutId);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      // app probably stopped
      break;
    } else {
      throw error;
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
}
Deno.exit(0);