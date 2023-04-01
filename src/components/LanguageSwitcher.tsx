import styles from "@/components/styles/switcher.module.css";
import fonts from "@/styles/font.module.css";
import { useRouter } from "next/router";

export default function LanguageSwitcher(props: {
  float: string;
  narrow: string;
}) {
  const lblCls =
    "px-4 py-3 flex justify-center cursor-pointer hover:bg-white/50 transition-all w-16 bg-slate-100/50";

  const router = useRouter();
  const changeLanguage = (lng: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: lng });
  };
  const enCls = router.locale === "en-US" ? styles.active : "";
  const cnCls = router.locale === "zh-CN" ? styles.active : "";
  const floatCls =
    props.float === ""
      ? ""
      : props.float === "left"
      ? styles.floatLeft
      : styles.floatRight;
  const narrowCls = props.narrow === "narrow" ? styles.narrow : "";
  return (
    <div className={"flex z-40 " + floatCls + " " + narrowCls}>
      <div
        className={
          fonts.enRegular +
          " " +
          styles.langLblLeft +
          " " +
          enCls +
          " " +
          lblCls
        }
        onClick={() => changeLanguage("en-US")}
      >
        EN
      </div>
      <div
        className={
          fonts.cnRegular +
          " " +
          styles.langLblRight +
          " " +
          cnCls +
          " " +
          lblCls
        }
        onClick={() => changeLanguage("zh-CN")}
      >
        中文
      </div>
    </div>
  );
}
