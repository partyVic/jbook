import React, { useRef } from 'react'
import MonacoEditor, { OnMount, Monaco } from "@monaco-editor/react";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import prettier from 'prettier'
import parserBabel from "prettier/parser-babel";
import './code-editor.css'

interface CodeEditorProps {
    initialValue: string
    onChange: (value: string) => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {

    // use useRef to hold a value to a variable
    const editorRef = useRef<any>();

    // used for update the value and pass up to parent by using onChange
    const onEditorDidMount: OnMount = (
        editor: monaco.editor.IStandaloneCodeEditor,
        monaco: Monaco
    ) => {

        // assign the editor value to useRef, make an instance of monaco in order to get value from the editor
        editorRef.current = editor;

        editor.onDidChangeModelContent(() => onChange(editor.getValue()));
    };

    const onFormatClick = () => {
        if (editorRef.current) {

            // get current value from editor
            const unformatted = editorRef.current.getValue();

            // format that value
            const formatted = prettier.format(unformatted, {
                parser: "babel",
                plugins: [parserBabel],
                useTabs: false,
                semi: true,
                singleQuote: true,
            }).replace(/\n$/, '')   // auto format will create a new line at the end. use RegEx to remove the new line

            // set the formatted value back in the editor
            editorRef.current.setValue(formatted);
        }
    };

    return (
        <div className='editor-wrapper'>
            <button
                className='button button-format is-primary is-small'
                onClick={onFormatClick}
            >
                Format
            </button>

            <MonacoEditor
                height={500}
                onMount={onEditorDidMount}
                value={initialValue}      // this is ONLY for setting up initial value. NOT used for value update
                language='javascript'
                theme="vs-dark"
                options={{
                    minimap: {
                        enabled: false,
                    },
                    wordWrap: "on",
                    showUnused: true,
                    folding: false,
                    lineNumbersMinChars: 3,
                    fontSize: 16,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                }}
            />
        </div>
    )
}

export default CodeEditor