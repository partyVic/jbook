import React, { useState, useEffect, useRef } from 'react'
import CodeEditor from './code-editor'
import Preview from './preview'
import Resizable from './resizable'
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector'
import './code-cell.css';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {

  // use useRef instead of useState for reasons of:
  // 1. Not cause rerendering
  // 2. The value it stores can be access anywhere inside of the component
  // 3. ref value will lost between a component mount/unmount
  // const ref = useRef<any>()

  // const [code, setCode] = useState('')
  // const [err, setErr] = useState('');
  // const [input, setInput] = useState('')

  const { updateCell, createBundle } = useActions();

  //! add "!" after "state.bundles" to tell TypeScript that you will never pass an undefined value there. 
  const bundle = useTypedSelector((state) => state.bundles![cell.id]);



  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cell.content)
      return
    }

    //! debouncing
    // only bundle once user stop input after 750ms
    const timer = setTimeout(async () => {
      // const output = await bundle(cell.content);
      // setCode(output.code);
      // setErr(output.err);

      createBundle(cell.id, cell.content)
    }, 750);

    //! use the return function inside of useEffect is a build-in feature
    //! if return a function, then it will be called automatically the next time usEffect is called
    // clear the timer when user start input( [input] changes)
    return () => {
      clearTimeout(timer);
    };

    //! don't put bundle as dependency in useEffect, it may cause infinite loop
    // use below to disable react warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.content, cell.id, createBundle]);


  return (
    <Resizable
      direction='vertical'
    >

      {/* //! calc(100% - 10px) 10px is the height of resize bar */}
      <div style={{ height: 'calc(100% - 10px)', display: 'flex', flexDirection: 'row' }}>

        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>

        <div className="progress-wrapper">
          {!bundle || bundle.loading
            ? (
              <div className="progress-cover">
                <progress className="progress is-small is-primary" max="100">
                  Loading
                </progress>
              </div>
            )
            : (
              <Preview code={bundle.code} err={bundle.err} />
            )}
        </div>
      </div>
    </Resizable>
  )
}

export default CodeCell