import React, { useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import ChatMessageUI from './ChatMessage';
import { useEffect } from 'react';
import Image from 'next/image';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import WaitingLbl from './WaitingLbl';
import { localeToFontCls } from '@/utils/fontCls';
import { useTranslation } from 'next-i18next';
import { BsRobot } from 'react-icons/bs';
export interface ChatMessage{
    role: string;
    content: string;
}

interface MessageBoxProps {
  messages: ChatMessage[];
  localeStr: string;
}
// Define the shape of the ref object
export interface MessageBoxRef {
    addMessage: (msg: ChatMessage, isFinished: boolean) => void;
    getMessage:() => ChatMessage[]
    showWaiting: (show: boolean) => void;
    setFailed: () => void;
}
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

const ChatBox = React.forwardRef<MessageBoxRef, MessageBoxProps>((props, ref) => {

    
    let tmp : JSX.Element[] = [];
    const [renderedMessages, setRenderedMessages] = useState(tmp);
    const [duringQuery, setDuringQuery] = useState(false);
    const [isError, setIsError] = useState(false);
    const [messages, setMessages]  = useState(props.messages);
    const divRef = useRef<HTMLDivElement>(null);
    let previousHeight = 0;
    const {t} = useTranslation("chat");
    function scrollToBottom(){
        if(divRef.current == null) {
            return;
        }
        if(divRef.current.scrollHeight > previousHeight) {
          console.log(previousHeight);
            previousHeight = divRef.current.scrollHeight;
            divRef.current.scrollTo({top: divRef.current.scrollHeight, behavior:'smooth'});
        }
        
    }
    useEffect(() => {
        async function renderMessages() {
          const promises = messages.map((message, idx) => ChatMessageUI({message: message, localeStr: props.localeStr, idx: idx, 
            scroll: scrollToBottom}));
          const rendered = await Promise.all(promises);
          setRenderedMessages(rendered);
        }
        renderMessages();
      }, [messages]);
    useEffect(()=>{
      scrollToBottom()
    },[renderedMessages])

    useImperativeHandle(ref, () => ({
        addMessage: (msg: ChatMessage, isFinished: boolean) => {
          setDuringQuery(isFinished);
          setMessages(prev => [...prev, msg]);
        },
        getMessage: (): ChatMessage[] =>{
          return messages;
        },
        showWaiting: (flag: boolean) => {
          setDuringQuery(flag);
        },
        setFailed: ()=>{
          setDuringQuery(false);
          setIsError(true);
        }
      }));
      return (
        <div  ref={divRef}  className='relative flex item flex-1 w-8/12 mx-auto px-4 min-h-0 overflow-y-auto mb-4  scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md'>
            <TransitionGroup>
            {messages.length > 0 && (
                <CSSTransition
                classNames="fade"
                timeout={500}
                unmountOnExit
                >
                <div className='absolute inset-0 flex flex-col'>
                            {renderedMessages}    
                            {duringQuery && <WaitingLbl localeStr={props.localeStr}/>}
                            {isError && <div className={"bg-red-200/30  border border-red-500 shadow-lg mb-2 text-red-500 px-4 py-2 text-sm rounded-md mx-auto flex items-center justify-center  " + localeToFontCls(props.localeStr, "heavy")}>
                            <div className='flex align-center justify-items-end mr-2'>
                        <BsRobot size={40} />
                    </div><span>{t("ChatErrHint")}</span>
                              </div>}
                </div>
                        
                </CSSTransition>
            )}
            {messages.length == 0 && (
                <CSSTransition
                classNames="fade"
                timeout={200}
                unmountOnExit
                >
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
      );
    

});
export default ChatBox;
ChatBox.displayName = "ChatBox";