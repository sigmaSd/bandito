/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Head } from "$fresh/runtime.ts";
import { StateUpdater, useState } from "preact/hooks";
import { AppConfigProps, AppProps } from "../interfaces/table.ts";

export function Limit(
  { limit, activate }: {
    limit?: number;
    activate: StateUpdater<boolean>;
  },
) {
  const [isChecked, setIsChecked] = useState(false);
  const handleCheck = () => {
    activate(!isChecked);
    setIsChecked(!isChecked);
  };
  return (
    <div>
      {limit &&
        (
          <div>
            <input
              checked={isChecked}
              onChange={handleCheck}
              type="checkbox"
              class={tw`m-1`}
            />
            {limit}
          </div>
        )}
    </div>
  );
}
export function Row(
  { app, setAppConfigProps }: {
    app: AppProps;
    setAppConfigProps: StateUpdater<AppConfigProps>;
  },
) {
  const [dlLimitActive, setDlLimitActive] = useState(false);
  const [upLimitActive, setUpLimitActive] = useState(false);

  return (
    <tr>
      <th>
        <button
          class={tw`font-serif font-semibold italic text-blue-600 cursor-pointer`}
          onClick={() => {
            setAppConfigProps({ ...app, dlLimitActive, upLimitActive });
          }}
        >
          {app.name}
        </button>
      </th>
      <th>
        {app.downloadRate}
      </th>
      <th>
        {app.uploadRate}
      </th>
      <th>
        <Limit
          limit={app.downloadLimit}
          activate={setDlLimitActive}
        />
      </th>
      <th>
        <Limit
          limit={app.uploadLimit}
          activate={setUpLimitActive}
        />
      </th>
    </tr>
  );
}

function Table(
  { setAppConfigProps }: { setAppConfigProps: StateUpdater<AppConfigProps> },
) {
  const firefox = {
    name: "firefox",
    downloadLimit: 450,
    downloadRate: 300,
    uploadRate: 50,
  };
  const speedtest = {
    name: "speedtest",
    downloadLimit: 250,
    downloadRate: 100,
    uploadRate: 60,
  };

  const apps = [firefox, speedtest];
  const body = apps.map((app) => Row({ app, setAppConfigProps }));
  return (
    <div>
      <Head>
        <link rel="stylesheet" href="/table.css" />
      </Head>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>DL Rate</th>
            <th>UL Rate</th>
            <th>DL Limit</th>
            <th>UL Limit</th>
          </tr>
        </thead>
        <tbody>
          {body}
        </tbody>
      </table>
    </div>
  );
}

function AppConfig(
  { name, downloadLimit, uploadLimit, dlLimitActive, upLimitActive }:
    AppConfigProps,
) {
  if (!name) {
    return <div></div>;
  }
  const UnitChoice = () => {
    return (
      <select class={tw`mt-3`}>
        <option>bbps</option>
        <option selected>Kbps</option>
        <option>Mbps</option>
      </select>
    );
  };
  return (
    <div class={tw`ml-20`}>
      <h3 class={tw`font-bold`}>Name: {name}</h3>
      <table>
        <thead>
          <tr>
            <th>Dir</th>
            <th>Value</th>
            <th>Unit</th>
            <th>State</th>
          </tr>
        </thead>
        <tr>
          <th>In</th>
          <th>{downloadLimit}</th>
          <UnitChoice />
          <th class={dlLimitActive ? tw`text-green-400` : tw`text-red-400`}>
            {dlLimitActive ? "Active" : "Disabled"}
          </th>
        </tr>
        <tr>
          <th>Out</th>
          <th>{uploadLimit}</th>
          <UnitChoice />
          <th class={upLimitActive ? tw`text-green-400` : tw`text-gray-400`}>
            {upLimitActive ? "Active" : "Disabled"}
          </th>
        </tr>
      </table>
    </div>
  );
}

export default function App() {
  const [appConfigProps, setAppConfigProps] = useState({});
  return (
    <div class={tw`flex`}>
      <Table setAppConfigProps={setAppConfigProps} />
      <AppConfig {...appConfigProps} />
    </div>
  );
}
