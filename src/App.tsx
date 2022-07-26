import React, { useState, useEffect, useRef } from 'react'
import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'
import CodeEditor from './components/code-editor'

const App = () => {

  // use useRef instead of useState for reasons of:
  // 1. Not cause rerendering
  // 2. The value it stores can be access anywhere inside of the component
  // 3. ref value will lost between a component mount/unmount
  const ref = useRef<any>()

  const iframe = useRef<any>()

  const [input, setInput] = useState('')


  const startService = async () => {
    // use ref.current to store the value can be access as global variable inside of the component
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });

  };


  useEffect(() => {
    startService();
  }, []);


  const onClick = async () => {
    if (!ref.current) {
      return
    }

    // reset the iframe ref to default html if anyone changes the html element
    iframe.current.srcdoc = html;


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
      plugins: [
        unpkgPathPlugin(),
        fetchPlugin(input)
      ],
      define: {
        'process.env.NODE_ENV': '"production"',  // use '"production" means replace the string of production, not the variable of prodection
        global: 'window'
      }
    })

    // console.log(result)

    // setCode(result.outputFiles[0].text)

    // child document used postMessage to enables cross-origin communication between Window objects
    // "*" means any origin
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  }


  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
              console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  return (
    <div>

      <CodeEditor
        initialValue='hello'
        onChange={(value) => setInput(value)}
      />

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>

      <iframe title='preview' ref={iframe} sandbox="allow-scripts" srcDoc={html} />

    </div>
  )
}

export default App
