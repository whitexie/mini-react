import ReactDom from './core/ReactDom.js'
import App from './App.jsx'



const app = App()
console.log(App, app);

ReactDom.createRoot(document.getElementById("root")).render(app)


