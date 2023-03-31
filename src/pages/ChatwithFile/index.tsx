import { useRouter } from 'next/router'
import fonts from '@/styles/font.module.css'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Layout from '@/pages/Layout'
import {GrSend} from 'react-icons/gr'
import chatStyle from '@/styles/chat.module.css'
import  AutoResizeTextArea , {AutosizeRef} from '@/components/AutoResizeTextArea'
import MessageBox , {MessageBoxRef} from '@/components/ChatBox/ChatBox'
import { ChatMessage  } from '@/components/ChatBox/ChatBox'
import { useRef } from 'react'
import FileSidebar from '@/components/Sidebar/FileSidebar'
import { getSession , signIn, signOut } from 'next-auth/react'
import { Session } from 'next-auth'
import { User } from '@/utils/User'
type Props = {
  session: Session
  // Add custom props here
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


export default function Auth(_props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const user = _props.session.user as User;
    const messageBoxRef = useRef<MessageBoxRef>(null);
    const textAreaRef = useRef<AutosizeRef>(null);
const sendMsg = function(str: string){
    messageBoxRef?.current?.addMessage({role: 'user', content: str}, true);
    messageBoxRef?.current?.addMessage({role: 'bot', content: str}, false);
}
const handleSend = function(){
    console.log(textAreaRef);
    var txt = textAreaRef?.current?.content();
    
    if(txt){
        sendMsg(txt);
    }
}

  const router = useRouter()
  const { t } = useTranslation('chat')
  const fontCls = router.locale === 'en-US' ? fonts.enRegular: fonts.cnRegular;
  const fontHeavyCls = router.locale === 'en-US' ? fonts.enHeavy : fonts.cnHeavy;
  let messages: ChatMessage[] = [];
  return (
    <Layout>
        <div className={chatStyle.aloneContainer}>
            <FileSidebar localeStr={router.locale!} files={["ada.pdf", "rweaedasd.pdf", "ada0.pdf","ada1.pdf","ada2.pdf","ada3.pdf","ada4.pdf"]} userName={_props.session?.user?.name?? ""} />
            <div className="flex flex-col py-20  mx-auto flex-1">
                    <MessageBox ref={messageBoxRef} messages={messages} localeStr={router.locale!} />
                <div className='relative flex w-8/12 mx-auto shadow-lg border border-gray-200 rounded-md pl-4 py-4 bg-white'>
                    <div className='overflow-y-auto flex w-full pr-10 scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md'
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