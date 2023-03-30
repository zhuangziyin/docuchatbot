import React, { useLayoutEffect, useRef, useState, KeyboardEvent, useImperativeHandle, RefObject } from 'react';
import { Ref } from 'react';
interface AutoResizeTextAreaProps {
  initHeight: number;
  className: string;
  children: never[];
  SendMessage: (str: string) => void;
}
export interface AutosizeRef{
    content: ()=>string;

}
const AutoResizeTextArea = React.forwardRef<AutosizeRef, AutoResizeTextAreaProps>((props, ref): JSX.Element => {
  const [height, setHeight] = useState<number>(props.initHeight);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      const clientHeight = textareaRef.current.clientHeight;
      const scrollHeight = textareaRef.current.scrollHeight;
      if (clientHeight < scrollHeight) {
        setHeight(scrollHeight);
      }
    }
  }, [textareaRef, height]);
  useImperativeHandle(ref, () => ({
    content : () : string => {
        return textareaRef.current?.value ? textareaRef.current?.value : "" ;
    }

  }));
  const handleKeyDown = (event: KeyboardEvent) =>{
    if (event.key === 'Enter' && !event.shiftKey) {
        props.SendMessage(textareaRef.current?.value!);
        if (textareaRef.current) {
            textareaRef.current.value = "";
            setHeight(props.initHeight);
          }
      }
      else{
        if (textareaRef.current) {
            const clientHeight = textareaRef.current.clientHeight;
            const scrollHeight = textareaRef.current.scrollHeight;
            if (clientHeight >= scrollHeight) {
              setHeight(props.initHeight);
            } else if (scrollHeight) {
              setHeight(scrollHeight);
              
            }
          }

      }

  }

  return (
    <textarea
      ref={textareaRef}
      className={props.className}
      onKeyUp={handleKeyDown}
      style={{ height: height ? `${height}px` : 'auto', overflowY: 'hidden' }}
    />
  );
});

export default AutoResizeTextArea;
AutoResizeTextArea.displayName = "AutoResizeTextArea";