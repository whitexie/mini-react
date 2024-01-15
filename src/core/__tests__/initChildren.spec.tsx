import { describe, it } from "vitest";
import React from "../React";
import { initChidren } from "../React";

describe("initChidren", () => {
  it("function component", () => {
    const App = ({ name }) => <div>Hello App{name}</div>;
    const children = initChidren({ type: "div", props: { children: [] }, dom: null, parent: null, sibling: null, child: null }, <App name="123" />);
  });
});
