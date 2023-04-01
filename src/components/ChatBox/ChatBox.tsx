import React, { useRef, useState } from "react";
import ChatMessageUI, { ChatMessageRef } from "./ChatMessage";
import { useEffect } from "react";
import Image from "next/image";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { localeToFontCls } from "@/utils/fontCls";
import { useTranslation } from "next-i18next";
import { BsRobot } from "react-icons/bs";
import { GrSend } from "react-icons/gr";
import { ImSpinner9 } from "react-icons/im";
import AutoResizeTextArea, {
  AutosizeRef,
} from "@/components/AutoResizeTextArea";
import { ChatCompletion } from "@/utils/Chat";
import { MarkdowntoReact } from "@/MarkdownProcessor";
import ModelSelector, { LevelSelectorRef } from "@/components/ModelSelect";

export interface ChatMessage {
  role: string;
  content: string;
}

interface MessageBoxProps {
  messages: ChatMessage[];
  localeStr: string;
  superUser: boolean;
}
// Define the shape of the ref object
export interface MessageBoxRef {}
interface Props {
  condition: boolean;
  children: React.ReactNode;
}
const AnimatedComponent: React.FC<Props> = ({ condition, children }) => {
  return (
    <CSSTransition in={condition} timeout={500} classNames="fade">
      {children}
    </CSSTransition>
  );
};

const ChatBox = React.forwardRef<MessageBoxRef, MessageBoxProps>(
  (props, ref) => {
    let tmp: JSX.Element[] = [];
    const [renderedMessages, setRenderedMessages] = useState(tmp);
    const [duringQuery, setDuringQuery] = useState(false);
    const [isError, setIsError] = useState(false);
    const [messages, setMessages] = useState(props.messages);
    const maxRef = useRef<ChatMessageRef | null>(null);
    const textAreaRef = useRef<AutosizeRef>(null);

    const modelRef = useRef<LevelSelectorRef>(null);
    const divRef = useRef<HTMLDivElement>(null);
    let previousHeight = 0;
    const { t } = useTranslation("chat");
    function scrollToBottom() {
      if (divRef.current == null) {
        return;
      }
      if (divRef.current.scrollHeight > previousHeight) {
        previousHeight = divRef.current.scrollHeight;
        divRef.current.scrollTo({
          top: divRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
    useEffect(() => {
      async function renderMessages() {
        let rendered = messages.map((message, idx) =>
          isError && idx == messages.length - 1 ? null : (
            <ChatMessageUI
              key={idx.toString()}
              message={message}
              localeStr={props.localeStr}
              idx={idx}
              scroll={scrollToBottom}
              active={idx == messages.length - 1}
              ref={idx === messages.length - 1 ? maxRef : null}
            />
          )
        );
        let final = rendered.filter((x) => x !== null) as JSX.Element[];
        setRenderedMessages(final);
      }
      renderMessages();
    }, [messages, props.localeStr, isError]);
    useEffect(() => {
      scrollToBottom();
    }, [renderedMessages]);
    useEffect(() => {}, [props.superUser]);
    const finishedQuery = (flag: boolean) => {
      setDuringQuery(!flag);
      maxRef?.current?.setfinished(flag);
    };
    const addMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };
    const setHtml = (html: string) => {
      maxRef?.current?.setHtml(html);
    };
    const showWaiting = (flag: boolean) => {
      finishedQuery(!flag);
    };
    const setFailed = () => {
      finishedQuery(true);
      setIsError(true);
    };

    const sendMsg = async function (str: string) {
      handleStart();
      let curMsgs = JSON.parse(JSON.stringify(messages));
      curMsgs.push({ role: "user", content: str });
      addMessage({ role: "user", content: str });
      const res = await MarkdowntoReact("&nbsp;");
      addMessage({ role: "assistant", content: res });
      await ChatCompletion(
        curMsgs,
        modelRef.current?.GetModel() ?? "gpt-3.5-turbo",
        setHtml,
        handleError,
        () => {
          showWaiting(false);
        }
      );
    };
    const handleStart = function () {
      showWaiting(true);
    };
    const handleError = function () {
      setFailed();
    };
    const handleSend = function () {
      if (!duringQuery && !isError) {
        var txt = textAreaRef?.current?.content();
        if (txt) {
          sendMsg(txt);
        }
      }
    };
    return (
      <div className="flex flex-col py-12  mx-auto flex-1 relative">
        <ModelSelector isSuper={props.superUser} ref={modelRef} />
        <div
          ref={divRef}
          className="relative flex item flex-1 w-8/12 mx-auto px-4 min-h-0 overflow-y-auto mb-4  scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md"
        >
          <TransitionGroup>
            {messages.length > 0 && (
              <CSSTransition classNames="fade" timeout={500} unmountOnExit>
                <div className="absolute inset-0 flex flex-col">
                  {renderedMessages}
                  {isError && (
                    <div
                      className={
                        "bg-red-200/30  border border-red-500 shadow-lg mb-2 text-red-500 px-4 py-2 text-sm rounded-md mx-auto flex items-center justify-center  " +
                        localeToFontCls(props.localeStr, "heavy")
                      }
                    >
                      <div className="flex align-center justify-items-end mr-2">
                        <BsRobot size={40} />
                      </div>
                      <span>{t("ChatErrHint")}</span>
                    </div>
                  )}
                </div>
              </CSSTransition>
            )}
            {messages.length == 0 && (
              <CSSTransition classNames="fade" timeout={200} unmountOnExit>
                <Image
                  src="/Chaticon.svg"
                  alt="OpenAI Logo"
                  className="w-1/5 inset-0 left-80 mx-auto fixed  my-auto z-10"
                  width={300}
                  height={300}
                  priority
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </div>
        {!isError && (
          <div className="relative flex w-8/12 mx-auto shadow-lg border border-gray-200 rounded-md pl-4 py-4 bg-white">
            <div
              className="flex overflow-y-auto w-full pr-10 scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md"
              style={{
                maxHeight: 200,
                fontSize: 0,
                flexDirection: "column-reverse",
              }}
            >
              <div>
                <AutoResizeTextArea
                  ref={textAreaRef}
                  className="text-sm m-0 resize-none w-full outline-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
                  initHeight={24}
                  SendMessage={sendMsg}
                  disabled={duringQuery || isError}
                ></AutoResizeTextArea>
                {!duringQuery && (
                  <div
                    className="absolute bottom-4 right-4 opacity-30 cursor-pointer"
                    onClick={handleSend}
                  >
                    <GrSend size={24} />
                  </div>
                )}
                {duringQuery && (
                  <div className="absolute bottom-4 right-4 opacity-30 cursor-default spinner">
                    <ImSpinner9 size={24} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
export default ChatBox;
ChatBox.displayName = "ChatBox";
