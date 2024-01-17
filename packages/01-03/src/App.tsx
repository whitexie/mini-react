import React from "./core/React.ts";

// const App = React.createElement("div", { id: "app" }, "hhhhh", { type: "a", props: { id: "a", children: ["123456"] } });

// const App = <div>hi,mini-react</div>;

let count = 0;
let props: any = { id: "sss" };
function Counter({ num }) {
  function onClick(e) {
    count++;
    console.log("e ", e, num);
    props = {};
    React.update();
  }

  return (
    <div>
      Counter {num}
      <h3 {...props}>{count}</h3>
      <button onClick={onClick}>click me</button>
    </div>
  );
}

function App() {
  return (
    <div>
      hi,mini-react
      <Counter num={321} />
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
