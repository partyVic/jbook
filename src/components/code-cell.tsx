import React, { useState, useEffect, useRef } from 'react'
import CodeEditor from './code-editor'
import Preview from './preview'
import bundle from '../bundler'
import Resizable from './resizable'

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
    <Resizable
      direction='vertical'
    >

      <div style={{height:'100%', display:'flex', flexDirection:'row'}}>
        <CodeEditor
          initialValue='hello'
          onChange={(value) => setInput(value)}
        />

        <Preview
          code={code}
        />
      </div>
    </Resizable>
  )
}

export default CodeCell