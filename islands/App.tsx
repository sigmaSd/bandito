import { Head } from "$fresh/runtime.ts";
import { StateUpdater, useEffect, useState } from "preact/hooks";
import { AppProps, Unit } from "../interfaces/table.ts";

export function Limit(
  { limit, setLimit }: {
    limit: { value: number; unit: Unit };
    setLimit: StateUpdater<{ value: number; unit: Unit }>;
  },
) {
  const [selectedUnit, setSelectedUnit] = useState<Unit>("kbps");
  const UnitChoice = () => {
    return (
      <select
        value={selectedUnit}
        onChange={(e) =>
          setSelectedUnit((e.target as HTMLSelectElement).value as Unit)}
        class="ml-1 min-w-fit border-black-400  border rounded-lg bg-white"
      >
        <option value="bps">Bps</option>
        <option value="kbps">Kbps</option>
        <option value="mbps">Mbps</option>
      </select>
    );
  };
  return (
    <div class="flex">
      <input
        onInput={(event) => {
          const newValue = parseFloat((event.target as HTMLInputElement).value);
          setLimit({
            value: newValue,
            unit: selectedUnit,
          });
        }}
        class="font-mono text-center w-20 font-semibold"
        type="number"
        value={limit.value}
      />
      <UnitChoice />
    </div>
  );
}

export function Row(
  { app }: {
    app: AppProps;
  },
) {
  const [active, setActive] = useState(false);
  const [downloadLimit, setDownloadLimit] = useState({
    value: 450,
    unit: "kbps" as Unit,
  });
  const [uploadLimit, setUploadLimit] = useState({
    value: 450,
    unit: "kbps" as Unit,
  });

  useEffect(() => {
    if (active) {
      fetch("/api/eltrafico", {
        method: "POST",
        body: JSON.stringify({
          method: "limit",
          app: {
            name: app.name,
            downloadLimit,
            uploadLimit,
          },
        }),
      });
    } else {
      fetch("/api/eltrafico", {
        method: "POST",
        body: JSON.stringify({
          method: "limit",
          app: {
            name: app.name,
          },
        }),
      });
    }
  }, [active]);

  return (
    <tr>
      <th>
        <i
          class="font-serif font-semibold italic text-blue-600 cursor-pointer"
          style={{ color: active ? "green" : "" }}
        >
          {app.name}
        </i>
      </th>
      <th>
        {app.downloadRate
          ? (
            <div>
              {app.downloadRate} <i class="font-medium">kbps</i>
            </div>
          )
          : "__"}
      </th>
      <th>
        {app.uploadRate
          ? (
            <div>
              {app.uploadRate} <i class="font-medium">kbps</i>
            </div>
          )
          : "__"}
      </th>
      <th>
        <Limit
          limit={downloadLimit}
          setLimit={setDownloadLimit}
        />
      </th>
      <th>
        <Limit
          limit={uploadLimit}
          setLimit={setUploadLimit}
        />
      </th>
      <th>
        <input
          type="checkbox"
          checked={active}
          onChange={() => {
            setActive(!active);
          }}
          class="m-1"
        />
      </th>
    </tr>
  );
}

function Table() {
  const [apps, setApps] = useState<AppProps[]>([]);
  const [monitor, setMonitor] = useState<string>();

  useEffect(() => {
    fetch("/api/env?MONITOR").then((r) => r.text()).then((env) => {
      if (!env) {
        setMonitor("default");
      } else {
        setMonitor(env);
      }
    });
  }, []);

  if (monitor === "default") {
    useEffect(() => {
      setInterval(
        () =>
          fetch("/api/eltrafico", {
            method: "POST",
            body: JSON.stringify({
              method: "poll",
            }),
          }).then((r) => r.json()).then(setApps),
        1000,
      );
    }, []);
  } else if (monitor == "bandwhich") {
    useEffect(() => {
      setInterval(
        () => fetch("/api/netmonitor").then((r) => r.json()).then(setApps),
        1000,
      );
    }, []);
  }

  //NOTE: this sort is very important due to the dynamic way rows are created
  //FIXME: this doesn't handle all cases
  const body = apps
    ? apps.sort((a, b) => a.name.localeCompare(b.name)).map((app) => (
      <Row app={app} />
    ))
    : {};

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>DL Rate</th>
            <th>UL Rate</th>
            <th>DL Limit</th>
            <th>UL Limit</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {body}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Head>
        <link rel="stylesheet" href="/table.css" />
      </Head>
      <div class="flex">
        <Table />
      </div>
    </div>
  );
}
