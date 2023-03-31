import { useRouter } from 'next/router'
import { getSession} from 'next-auth/react'
import { useState } from 'react'
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
import { ChatCompletion } from '@/utils/Chat'
import { User } from '@/utils/User'
import ModelSelector, { LevelSelectorRef} from '@/components/ModelSelect'
type Props = {
  session: any;
}
export const getServerSideProps : GetServerSideProps<Props> = async ({
  locale,
  req
}) => {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/${locale}/Auth?callbackUrl=${encodeURIComponent('/Chat')}`,
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
      ...(await serverSideTranslations(locale ?? 'en-US', ['chat'])),
    },
  };
}

export default function Chat(_props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const user = _props.session.user as User;
    const [superUser, setSuperUser] = useState(user.userLevel !== null && user.userLevel > 0);
    const messageBoxRef = useRef<MessageBoxRef>(null);
    const textAreaRef = useRef<AutosizeRef>(null);
    const modelRef = useRef<LevelSelectorRef>(null);
    const sendMsg = async function(str: string){
  let curMsgs = JSON.parse(JSON.stringify(messageBoxRef?.current?.getMessage()));
  curMsgs.push({role: 'user', content: str});
  messageBoxRef?.current?.addMessage({role: 'user', content: str}, false);
  messageBoxRef?.current?.addMessage({role: 'assistant', content: ""}, false);
  console.log(modelRef.current?.GetModel());
  await ChatCompletion(curMsgs, modelRef.current?.GetModel() ?? "gpt-3.5-turbo",  messageBoxRef?.current?.setHtml);

}
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
            <div className="flex flex-col py-12  mx-auto flex-1 relative">
                <ModelSelector isSuper={superUser} ref={modelRef} />
                    <MessageBox ref={messageBoxRef} messages={messages} localeStr={router.locale!} />
                <div className='relative flex w-8/12 mx-auto shadow-lg border border-gray-200 rounded-md pl-4 py-4 bg-white'>
                    <div className='flex overflow-y-auto w-full pr-10 scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md'
                      style={{maxHeight: 200, fontSize: 0, flexDirection: 'column-reverse'}}>
                        <div>
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
        </div>
    </Layout>
    
  )
}