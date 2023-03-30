import React, { useState, useRef ,useEffect, useImperativeHandle } from "react";
import { Root, Text, Element, RootContent } from 'hast'

import { ReactElement } from "rehype-react/lib";
import { createRoot } from "react-dom/client";
import { StartTraverse, MarkdowntoReact } from "@/MarkdownProcessor";



var isInitialized : {[id: number]: boolean} = {};
function TypewriterEffect(props:{root: Root, idx: number, scroll: () => void, localeStr: string}) {
  const [text,  setText] = useState("");
  

  function callBackStr(str: string){
    setText(str);
    props.scroll();
  }

  //console.log(props.content);
  useEffect(() => {
    if(!(props.idx in isInitialized)){
        console.log("render");
        StartTraverse(props.root, callBackStr, props.localeStr);
        isInitialized[props.idx] = false;
    }
    
  }, []);
  return (
    <div style={{width: '100%'}} dangerouslySetInnerHTML={{__html : text}}  />
  );
}

export default TypewriterEffect;