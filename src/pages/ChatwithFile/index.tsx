import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Layout from "@/pages/Layout";
import chatStyle from "@/styles/chat.module.css";
import MessageBox, { MessageBoxRef } from "@/components/ChatBox/ChatBox";
import { ChatMessage } from "@/components/ChatBox/ChatBox";
import { useRef } from "react";
import FileSidebar from "@/components/Sidebar/FileSidebar";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { User } from "@/utils/User";
import { useState } from "react";

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
export default function Auth(
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
        <FileSidebar
          localeStr={router.locale!}
          files={[
            "ada.pdf",
            "rweaedasd.pdf",
            "ada0.pdf",
            "ada1.pdf",
            "ada2.pdf",
            "ada3.pdf",
            "ada4.pdf",
          ]}
          userName={session?.user?.name ?? ""}
        />
        <div className="flex flex-col py-20  mx-auto flex-1">
          <MessageBox
            ref={messageBoxRef}
            messages={messages}
            localeStr={router.locale!}
            superUser={superUser}
          />
        </div>
      </div>
    </Layout>
  );
}
