import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Layout from "@/pages/Layout";
import chatStyle from "@/styles/chat.module.css";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import MessageBox, { MessageBoxRef } from "@/components/ChatBox/ChatBox";
import { ChatMessage } from "@/components/ChatBox/ChatBox";
import { useRef } from "react";
import ChatSidebar from "@/components/Sidebar/ChatSidebar";
import { useSession } from "next-auth/react";

type Props = {};
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  // let session = await getServerSession(req, res, authOptions);
  // console.log(session);
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en-US", ["chat"])),
    },
  };
};
export default function Chat(
  _props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data: session, status } = useSession();
  let res =
    (session?.user?.userLevel !== undefined && session.user.userLevel > 0) ??
    false;
  console.log(res);
  const [superUser, setSuperUser] = useState(res);
  const messageBoxRef = useRef<MessageBoxRef>(null);
  const router = useRouter();
  let messages: ChatMessage[] = [];
  return (
    <Layout>
      <div className={chatStyle.aloneContainer}>
        <ChatSidebar chats={[]} localeStr={router.locale!} />
        <MessageBox
          ref={messageBoxRef}
          messages={messages}
          localeStr={router.locale!}
          superUser={superUser}
        />
      </div>
    </Layout>
  );
}
