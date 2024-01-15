import ReactDom from './core/ReactDom.js'
import App from './App.jsx'



const app = App()

ReactDom.createRoot(document.getElementById("root") as HTMLElement).render(app)


