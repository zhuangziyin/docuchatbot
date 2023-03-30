import { useSession, signIn, signOut } from "next-auth/react"
import styles from "@/components/styles/Signin.module.css"
import Image from 'next/image'

import fonts from '@/styles/font.module.css'
import { useTranslation } from 'next-i18next'
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import {GoAlert} from 'react-icons/go'
import { AiFillEye } from "react-icons/ai"
import { AiFillEyeInvisible } from "react-icons/ai"
import { callbackify } from "util"
import { encrypt } from "@/utils/Utils"
export default function Component(props:{localeStr: string}) {
  const router = useRouter();
  const handleLogin = async () => {
    const signInResult=await signIn('credentials',
      {
        "username": usernameRef.current?.value,
        "password":  encrypt(passwordRef.current?.value ?? ""),
        // The page where you want to redirect to after a 
        // successful login
        
        redirect:false
      });
      if(signInResult?.error){
        setIsError(true);
      }
      else{
        var callBack = new URL(signInResult?.url?? "/").searchParams.get('callbackUrl');
        if(!callBack || callBack == "" || callBack == "/"){
          router.push(
            {
              pathname:  callBack?? "/",
              query:{firstShow: true}
            });

        }
        else{
          router.push(callBack);

        }
        
      }
  }
  const removeErrHint = () => {
    setIsError(false);
  };
  const togglePassword = () => {
    setshowPassword(!showPassword);
  }
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isError, setIsError] = useState(false);
  const { t } = useTranslation('auth')
  const fontCls = props.localeStr === 'en-US' ? fonts.enLight: fonts.cnLight;
  const fontHeavyCls = props.localeStr === 'en-US' ? fonts.enHeavy : fonts.cnHeavy;
  const [showPassword, setshowPassword] = useState(false);
  return (<>
    <div className={styles.loginBox + " rounded-2xl"}>
      <div className={styles.loginLblBox}>
        <div className="flex items-center justify-center">
        <Image
                src="/PlaceHolder.svg"
                alt="icon"
                className={styles.vercelLogo}
                width={40}
                height={40}
                priority
              />
        </div>
        <div className={"flex items-center justify-center text-xl " + styles.lineTopMargin + ' ' + fontHeavyCls}>{t("SignIn")}</div>
              <div className={"flex items-center justify-center text-sm " + styles.lineTopMargin + ' ' + fontCls}>{t("SignInDesc")}</div>
      </div>
      <div className={styles.loginContentBox + " "  + fontCls}>
        {isError && <div className="self-center relative -top-2 text-red-500 text-sm bg-red-500/20 px-2 py-2 border border-red-300 rounded-md w-fit flex items-center">
          <GoAlert size={16} className="mr-2"></GoAlert>
          <span>{t("SignInError")}</span>
          </div>}
        <div className={styles.loginContentLbl+ ' text-xs'}>{t("Email")}</div>
        <input ref={usernameRef } className={"border-gray-300 py-2 px-3 rounded-md mt-1 " + styles.clearInput} onKeyDown={removeErrHint}></input>
        <div className={styles.loginContentLbl + ' text-xs' } style={{marginTop:'1rem'}}>{t("Password")}</div>
        <div className="relative flex">
          <input type={ showPassword ? "text" : "password"} ref={passwordRef} className={"w-full border-gray-300 py-2 px-3 rounded-md mt-1 " + styles.clearInput} onKeyDown={removeErrHint}></input>
          <div className="absolute right-2 z-10 flex h-full items-center" onClick={togglePassword}>
          {showPassword ? <AiFillEyeInvisible className="float-right" size={24}></AiFillEyeInvisible> : <AiFillEye size={24}></AiFillEye>}
          </div>
          
        </div>
        
        <button className="rounded-md border-black text-sm text-white bg-black border-black  py-2 px-3 mt-4" onClick={()=>handleLogin()}>{t("SignIn") }</button>
        <div className="flex items-center justify-center text-sm mt-3">
          <span>{t("NoAccountHint")}</span>&nbsp;<a href={t("SignUpLink")!} className="text-bold ">{t("SignUp")}</a>
        </div>

      </div>
      
    </div>
  </>)
}