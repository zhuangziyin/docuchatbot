import React, { useState, useImperativeHandle } from "react";
import { BsRobot } from "react-icons/bs";
import { ChatMessage } from "./ChatBox";
import { RiUser5Line } from "react-icons/ri";
interface MessageBoxProps {
  message: ChatMessage;
  localeStr: string;
  idx: number;
  scroll: () => void;
  active: boolean;
}

export interface ChatMessageRef {
  setHtml: (txt: string) => void;
  setfinished(finished: boolean): void;
}

import "highlight.js/styles/atom-one-dark.css";
import fonts from "@/styles/font.module.css";

const ChatMessageComponent = React.forwardRef<ChatMessageRef, MessageBoxProps>(
  (props, ref) => {
    const [text, setText] = useState(props.message.content);
    const [isFinished, setIsFinished] = useState(false);
    const fontCls = props.localeStr === "en-US" ? fonts.enLight : fonts.cnLight;
    useImperativeHandle(ref, () => ({
      setHtml: (txt: string) => {
        setText(txt);
        props.scroll();
      },
      setfinished(finished: boolean) {
        setIsFinished(finished);
      },
    }));

    if (props.message.role == "user") {
      return (
        <div
          className={"flex align-center px-4 mb-4 w-11/12 mx-auto " + fontCls}
        >
          <div className="flex mx-auto  grow  mb-4">
            <div className="flex align-center mr-8 justify-items-start">
              <RiUser5Line size={40} />
            </div>
            <div
              className="prose text-md grow shadow-lg border border-gray-200 rounded-md px-4 py-4 bg-gray-100/50 text-base scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md userprompt"
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                wordWrap: "break-word",
              }}
            >
              {props.message.content}
            </div>
            <div style={{ minWidth: 40 }}></div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={"flex align-center px-4  w-11/12 mx-auto  " + fontCls}>
          <div className="flex mx-auto grow mb-4 ">
            <div style={{ minWidth: 40 }}></div>
            <div
              style={{ maxWidth: "none" }}
              className="prose text-md flex flex-col items-start grow shadow-lg px-4 border border-gray-200 rounded-md mychat  bg-gray-100/50 scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md"
            >
              {/* <TypeWriterEffect root={result} idx={props.idx} scroll={props.scroll} localeStr={props.localeStr}/> */}
              <div
                style={{ width: "100%" }}
                className={!isFinished && props.active ? "" : "cursor-removed"}
                dangerouslySetInnerHTML={{ __html: text }}
              ></div>
            </div>
            <div className="flex align-center ml-8 justify-items-end">
              <BsRobot size={40} />
            </div>
          </div>
        </div>
      );
    }
  }
);
export default ChatMessageComponent;
ChatMessageComponent.displayName = "ChatMessageComponent";
