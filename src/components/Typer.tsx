import React, { useEffect, useImperativeHandle, useState } from "react";
import { OneTimeAppend } from "@/MarkdownProcessor";
interface TypeerProps {
    content: OneTimeAppend[],
    callback: ()=>void
  }
  export interface TyperRef{
    reset: ()=>void
  
  }

const Typer = React.forwardRef<TyperRef, TypeerProps>((props, ref): JSX.Element => {
    const [idx, setIdx] = useState(0);
    const [text, setText] = useState("");
    useEffect(() => {   
        if (idx < props.content.length) {
            setText(text + props.content[idx].value);
            const timer = setTimeout(() => {
                setIdx(idx + 1);
            }, props.content[idx].wait);
            
            return () => clearTimeout(timer);
          }
          else{
            
            setTimeout(() => {  
              props.callback();    
            }, 200);
            
          }
    },[idx])

    useImperativeHandle(ref, () => ({   
        reset: () =>{
            setIdx(0);
        }
        

    }));
    return <div className="transition-all flex" dangerouslySetInnerHTML={{__html: text}}>
    </div>

});
export default Typer;
Typer.displayName="Typer";