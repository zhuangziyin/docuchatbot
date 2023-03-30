import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from 'next-auth/react'
import fonts from '@/styles/font.module.css'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetServerSideProps, GetStaticProps, InferGetServerSidePropsType, InferGetStaticPropsType } from 'next'
import Layout from '@/pages/Layout'
import {GrSend} from 'react-icons/gr'
import chatStyle from '@/styles/chat.module.css'
import  AutoResizeTextArea , {AutosizeRef} from '@/components/AutoResizeTextArea'
import MessageBox , {MessageBoxRef} from '@/components/ChatBox/ChatBox'
import { ChatMessage  } from '@/components/ChatBox/ChatBox'
import { useEffect, useRef } from 'react'
import ChatSidebar from '@/components/Sidebar/ChatSidebar'
import { useSocket } from '@/SocketContext'
type Props = {
  // Add custom props here
}
export const getServerSideProps : GetServerSideProps<Props> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en-US', [
      'chat',
    ])),
  },
})

export default function Chat(_props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
    
  });
    const messageBoxRef = useRef<MessageBoxRef>(null);
    const textAreaRef = useRef<AutosizeRef>(null);
const sendMsg = async function(str: string){

let curMsgs = JSON.parse(JSON.stringify(messageBoxRef?.current?.getMessage()));
  curMsgs.push({role: 'user', content: str});
  messageBoxRef?.current?.addMessage({role: 'user', content: str}, true);
const response = await fetch("/api/chat/completion", {
  body:JSON.stringify(curMsgs),
  method: 'POST'
});
const msg = await response.json();
messageBoxRef?.current?.addMessage(msg, false);  

}
const { socket } = useSocket();
useEffect(() => {
  socket?.on("connect", () => {
    socket.emit("testApi", "Test");
  });
  
},[socket]);
const handleSend = function(){
    var txt = textAreaRef?.current?.content();
    
    if(txt){
        sendMsg(txt);
    }
}
  const router = useRouter()
  let messages: ChatMessage[] = [];
  return (
    <Layout>
        <div className={chatStyle.aloneContainer}>
            <ChatSidebar  chats={[]} localeStr={router.locale!}/>
            <div className="flex flex-col py-20  mx-auto flex-1">
                    <MessageBox ref={messageBoxRef} messages={messages} localeStr={router.locale!} />
                <div className='relative flex w-8/12 mx-auto shadow-lg border border-gray-200 rounded-md pl-4 py-4 bg-white'>
                    <div className='overflow-y-auto w-full pr-10 scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md'
                      style={{maxHeight: 200, fontSize: 0}}>
                    <AutoResizeTextArea ref={textAreaRef} className="text-sm m-0 resize-none w-full outline-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
                      initHeight={24} SendMessage={sendMsg}>
                    </AutoResizeTextArea>
                    <div className='absolute bottom-4 right-4 opacity-30 cursor-pointer' onClick={handleSend}>
                        <GrSend size={24}/>
                    </div>
                    </div>
                    
                </div>
                
                
            </div>
        </div>
    </Layout>
    
  )
}