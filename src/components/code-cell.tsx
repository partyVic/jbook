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
  const [err, setErr] = useState('');
  const [input, setInput] = useState('')


  // debouncing
  // only bundle once user stop input after 750ms
  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(input);
      setCode(output.code);
      setErr(output.err);
    }, 750);

    //! use the return function inside of useEffect is a build-in feature
    //! if return a function, then it will be called automatically the next time usEffect is called
    // clear the timer when user start input( [input] changes)
    return () => {
      clearTimeout(timer);
    };
  }, [input]);


  return (
    <Resizable
      direction='vertical'
    >

      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>

        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue='const a = 1'
            onChange={(value) => setInput(value)}
          />
        </Resizable>

        <Preview
          code={code}
          err={err}
        />
      </div>
    </Resizable>
  )
}

export default CodeCell