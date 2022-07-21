import React, { useState, useEffect, useRef } from 'react'
import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'

const App = () => {

  // use useRef instead of useState for reasons of:
  // 1. Not cause rerendering
  // 2. The value it stores can be access anywhere inside of the component
  // 3/ ref value will lost between a component mount/unmount
  const ref = useRef<any>()

  const [input, setInput] = useState('')
  const [code, setCode] = useState('')


  const startService = async () => {
    // use ref.current to store the value can be access as global variable inside of the component
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',   //esbuild.wasm is from React public folder
    });

  };


  useEffect(() => {
    startService();
  }, []);


  const onClick = async () => {
    if (!ref.current) {
      return
    }

    // transform/transpire the jsx code into pure javascript in the browser
    // const result = await ref.current.transform(input, {
    //   loader: 'jsx',
    //   target: 'es2015'
    // })

    // bundle all the import linked files into one file
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
      define: {
        'process.env.NODE_ENV': '"production"',  // use '"prodection" means replace the string of production, not the variable of prodection
        global: 'window'
      }
    })

    // console.log(result)

    setCode(result.outputFiles[0].text)
  }

  return (
    <div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  )
}

export default App
