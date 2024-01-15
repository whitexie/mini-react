import React from './core/React.ts'
import ReactDom from './core/ReactDom.js'
import App from './App.tsx'



ReactDom.createRoot(document.getElementById("root") as HTMLElement).render(<App />)


