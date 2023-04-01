import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import fonts from "@/styles/font.module.css";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SignIn from "@/components/Signin";
import Layout from "@/components/Layout";
type Props = {
  // Add custom props here
};
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en-US", ["auth"])),
  },
});

export default function Auth(
  _props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const changeTo = router.locale === "en-US" ? "zh-CN" : "en-US";
  const fontCls = changeTo !== "en-US" ? fonts.enRegular : fonts.cnRegular;
  const fontHeavyCls = changeTo !== "en-US" ? fonts.enHeavy : fonts.cnHeavy;
  return (
    <Layout narrow="narrow">
      <SignIn localeStr={router.locale!} />
    </Layout>
  );
}
