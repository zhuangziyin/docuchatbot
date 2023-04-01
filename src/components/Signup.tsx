import { useSession, signIn, signOut } from "next-auth/react";
import styles from "@/components/styles/Signin.module.css";
import Image from "next/image";

import fonts from "@/styles/font.module.css";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  AiFillEyeInvisible,
  AiFillEye,
  AiFillCheckCircle,
} from "react-icons/ai";
import { GoAlert } from "react-icons/go";
import { encrypt } from "@/utils/Utils";
export default function Component(props: { localeStr: string }) {
  const router = useRouter();
  const { t } = useTranslation("auth");
  const [isError, setIsError] = useState(false);
  const [isSucceeded, setIsSucceeded] = useState(false);
  const [countdown, setcountdown] = useState(0);
  const handleSubmit = async () => {
    try {
      const curData = {
        name: usernameRef.current?.value,
        password: encrypt(passwordRef.current?.value ?? ""),
        email: emailRef.current?.value,
      };
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(curData),
      });
      if (response.ok) {
        startCountdown();
      }
    } catch (error) {
      setIsError(true);
    }
  };
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setcountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (isSucceeded) {
      router.push({
        pathname: "/Auth",
      });
    }
  }, [countdown]);

  const startCountdown = () => {
    setIsSucceeded(true);
    setcountdown(3);
  };

  const fontCls = props.localeStr === "en-US" ? fonts.enLight : fonts.cnLight;
  const fontHeavyCls =
    props.localeStr === "en-US" ? fonts.enHeavy : fonts.cnHeavy;
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPassword, setshowPassword] = useState(false);
  const togglePassword = () => {
    setshowPassword(!showPassword);
  };
  const removeErrHint = () => {
    setIsError(false);
  };
  return (
    <>
      <div className={styles.loginBox + " rounded-2xl"}>
        <div className={styles.loginLblBox}>
          <div className="flex items-center justify-center">
            <Image
              src="/favicon.ico"
              alt="icon"
              className={styles.vercelLogo}
              width={40}
              height={40}
              priority
            />
          </div>
          <div
            className={
              "flex items-center justify-center text-xl " +
              styles.lineTopMargin +
              " " +
              fontHeavyCls
            }
          >
            {t("SignUp")}
          </div>
          <div
            className={
              "flex items-center justify-center text-sm " +
              styles.lineTopMargin +
              " " +
              fontCls
            }
          >
            {t("SignUpDesc")}
          </div>
        </div>
        <div className={styles.loginContentBox + " " + fontCls}>
          {isSucceeded && (
            <div className="self-center relative -top-2 text-green-500 text-sm bg-green-500/20 px-2 py-2 border border-green-300 rounded-md w-fit flex items-center">
              <AiFillCheckCircle size={16} className="mr-2" />
              <span>
                {t("Dear") +
                  usernameRef.current?.value +
                  " " +
                  t("Welcome") +
                  countdown +
                  t("Seconds")}
              </span>
            </div>
          )}
          {isError && (
            <div className="self-center relative -top-2 text-red-500 text-sm bg-red-500/20 px-2 py-2 border border-red-300 rounded-md w-fit flex items-center">
              <GoAlert size={16} className="mr-2"></GoAlert>
              <span>{t("SignUpError")}</span>
            </div>
          )}
          <div className={styles.loginContentLbl + " text-xs"}>
            {t("UserName")}
          </div>
          <input
            ref={usernameRef}
            className={
              "border-gray-300 py-2 px-3 rounded-md mt-1 " + styles.clearInput
            }
            onKeyDown={removeErrHint}
            name="name"
          ></input>

          <div
            className={styles.loginContentLbl + " text-xs"}
            style={{ marginTop: "1rem" }}
          >
            {t("Email")}
          </div>
          <input
            ref={emailRef}
            className={
              "border-gray-300 py-2 px-3 rounded-md mt-1 " + styles.clearInput
            }
            onKeyDown={removeErrHint}
            name="email"
          ></input>

          <div
            className={styles.loginContentLbl + " text-xs"}
            style={{ marginTop: "1rem" }}
          >
            {t("Password")}
          </div>
          <div className="relative flex">
            <input
              type={showPassword ? "text" : "password"}
              ref={passwordRef}
              className={
                "w-full border-gray-300 py-2 px-3 rounded-md mt-1 " +
                styles.clearInput
              }
              onKeyDown={removeErrHint}
            ></input>
            <div
              className="absolute right-2 z-10 flex h-full items-center"
              onClick={togglePassword}
            >
              {showPassword ? (
                <AiFillEyeInvisible
                  className="float-right"
                  size={24}
                ></AiFillEyeInvisible>
              ) : (
                <AiFillEye size={24}></AiFillEye>
              )}
            </div>
          </div>
          <button
            className="rounded-md border-black text-sm text-white bg-black border-black  py-2 px-3 mt-4"
            onClick={handleSubmit}
          >
            {t("SignUp")}
          </button>
          <div className="flex items-center justify-center text-sm mt-3">
            <span>{t("HasAccountHint")}</span>&nbsp;
            <a href={t("SignInLink")!} className="text-bold ">
              {t("SignIn")}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
