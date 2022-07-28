import React, { useState, useEffect, useRef } from 'react'
import CodeEditor from './code-editor'
import Preview from './preview'
import bundle from '../bundler'

const CodeCell = () => {

  // use useRef instead of useState for reasons of:
  // 1. Not cause rerendering
  // 2. The value it stores can be access anywhere inside of the component
  // 3. ref value will lost between a component mount/unmount
  // const ref = useRef<any>()

  const [code, setCode] = useState('')
  const [input, setInput] = useState('')


  const onClick = async () => {
    const output = await bundle(input)
    setCode(output)
  }


  return (
    <div>

      <CodeEditor
        initialValue='hello'
        onChange={(value) => setInput(value)}
      />

      <div>
        <button onClick={onClick}>Submit</button>
      </div>

      <Preview
        code={code}
      />

    </div>
  )
}

export default CodeCell