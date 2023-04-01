import "@/styles/globals.css";
import "@/components/styles/animation.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { SocketProvider } from "@/SocketContext";
const myApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return <Component {...pageProps} />;
};
const AppWithI18n = appWithTranslation(myApp);
const AppWithAuth = (props: AppProps) => (
  <SocketProvider>
    <SessionProvider session={props.pageProps.session}>
      <AppWithI18n {...props} />
    </SessionProvider>
  </SocketProvider>
);

export default AppWithAuth;
