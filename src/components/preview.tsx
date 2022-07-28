import React, { useEffect, useRef } from 'react'

interface PreviewProps {
    code: string
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


const Preview: React.FC<PreviewProps> = ({ code }) => {

    const iframe = useRef<any>()

    useEffect(() => {

        // reset the iframe ref to default html if anyone changes the html element
        iframe.current.srcdoc = html;

        // child document used postMessage to enables cross-origin communication between Window objects
        // "*" means any origin
        iframe.current.contentWindow.postMessage(code, '*');

    }, [code])

    return (
        <iframe
            title='preview'
            ref={iframe}
            sandbox="allow-scripts"
            srcDoc={html}
        />
    )
}

export default Preview