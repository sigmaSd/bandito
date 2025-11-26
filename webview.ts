import { Webview } from "jsr:@webview/webview@0.9.0";

new Worker(new URL("./main.ts", import.meta.url), {
  type: "module",
});

const port = Number.parseInt(Deno.env.get("PORT") || "3425");

const webview = new Webview();
webview.title = "Bandito";
webview.navigate(`http://localhost:${port}`);

// wait for the backend to start
while (true) {
  try {
    const resp = await fetch(`http://localhost:${port}/api/eltrafico`, {
      method: "POST",
      body: JSON.stringify({
        method: "ping",
      }),
    }).then((res) => res.text());
    if (resp === "pong") {
      break;
    }
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

webview.run();

// tell the backend to stop
await fetch(`http://localhost:${port}/api/eltrafico`, {
  method: "POST",
  body: JSON.stringify({
    method: "stop",
  }),
});
// wait for the app to stop
while (true) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1000);

  try {
    await fetch(`http://localhost:${port}/api/eltrafico`, {
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
