import React from 'react'
import 'bulmaswatch/superhero/bulmaswatch.min.css'
import { Provider } from 'react-redux';
import { store } from './state';
import CodeCell from './components/code-cell'
import TextEditor from './components/text-editor'


const App = () => {
  return (
    <Provider store={store}>
      <div>
        <TextEditor />
      </div>
    </Provider>
  )
}

export default App
