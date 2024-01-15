import React from "./core/React.ts";

// const App = React.createElement("div", { id: "app" }, "hhhhh", { type: "a", props: { id: "a", children: ["123456"] } });

// const App = <div>hi,mini-react</div>;
function Counter() {
  return <p>Counter</p>;
}

// function App() {
//   return (
//     <div>
//       hi,mini-react
//       <Count />
//     </div>
//   );
// }

const App = (
  <div id='app-1'>
    hi,mini-react
    <Counter />
  </div>
);
export default App;
