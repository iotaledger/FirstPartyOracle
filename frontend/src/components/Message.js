import React, { useEffect, useRef } from "react";
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const Message = ({ message }) => {
  const code = useRef(null);

  useEffect(() => {
    highlight()
  }, []);

  const highlight = () => {
    try {
      hljs.highlightBlock(code.current);
    } catch (e) {
      console.log(hljs, window.hljs);
    }
  };

  return (
    <div className="highlightjs-component">
        <pre className="prettyprint lang-json">
        <code className="json prettyprint lang-json" ref={code}>
            {JSON.stringify(message, null, 2)}
        </code>
        </pre>
    </div>
  );
};

export default Message;