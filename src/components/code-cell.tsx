import React, { useState, useEffect, useRef } from 'react'
import CodeEditor from './code-editor'
import Preview from './preview'
import bundle from '../bundler'
import Resizable from './resizable'
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {

  // use useRef instead of useState for reasons of:
  // 1. Not cause rerendering
  // 2. The value it stores can be access anywhere inside of the component
  // 3. ref value will lost between a component mount/unmount
  // const ref = useRef<any>()

  const [code, setCode] = useState('')
  const [err, setErr] = useState('');
  // const [input, setInput] = useState('')
  
  const { updateCell } = useActions();


  // debouncing
  // only bundle once user stop input after 750ms
  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(cell.content);
      setCode(output.code);
      setErr(output.err);
    }, 750);

    //! use the return function inside of useEffect is a build-in feature
    //! if return a function, then it will be called automatically the next time usEffect is called
    // clear the timer when user start input( [input] changes)
    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);


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

        <Preview
          code={code}
          err={err}
        />
      </div>
    </Resizable>
  )
}

export default CodeCell