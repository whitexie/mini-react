import React from './core/React.js'

const App = React.createElement('div', { id: 'app' },
  "hi,",
  "mini",
  "-react",
  { type: 'div', props: { class: 'w-full', children: [] } },
  { type: 'a', props: {id: 'a', class: 'w-full', children: [] } },
)

export default App
