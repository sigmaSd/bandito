/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Table from "../islands/App.tsx";

export default function Home() {
  return (
    <div class={tw`text-lg grid h-screen place-items-center`}>
      <Table />
    </div>
  );
}
