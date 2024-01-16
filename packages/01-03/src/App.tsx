import React from "./core/React.ts";

// const App = React.createElement("div", { id: "app" }, "hhhhh", { type: "a", props: { id: "a", children: ["123456"] } });

// const App = <div>hi,mini-react</div>;
function Counter({ num }) {
  return <p>Counter {num}</p>;
}

function App() {
  return (
    <div>
      hi,mini-react
      <Counter num={321} />
      <Counter num={123} />
    </div>
  );
}

// const App = (
//   <div id='app-1'>
//     hi,mini-react
//     <Counter />
//   </div>
// );
export default App;