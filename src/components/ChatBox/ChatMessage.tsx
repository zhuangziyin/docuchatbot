import React, {createElement,  useLayoutEffect, Fragment, useRef, useState, useEffect } from 'react';
import {BsRobot} from 'react-icons/bs'
import { useTranslation } from 'react-i18next';
import { MarkdowntoReact} from '@/MarkdownProcessor';
import { ChatMessage } from './ChatBox';
import {RiUser5Line} from 'react-icons/ri';
import TypeWriterEffect from "./TypeWriter";
interface MessageBoxProps {
  message: ChatMessage;
  localeStr: string;
  idx: number;
  scroll: () => void;
}
import 'highlight.js/styles/atom-one-dark.css';
import fonts from '@/styles/font.module.css';

export default async function ChatMessageComponent(props: MessageBoxProps) {
    
    const fontCls = props.localeStr === 'en-US' ? fonts.enLight: fonts.cnLight;
    
    if(props.message.role == "user"){

        return (
            <div className={'flex align-center px-4 mb-4 w-11/12 mx-auto ' + fontCls}>
                <div className='flex mx-auto  grow  mb-4'>
                    <div className="flex align-center mr-8 justify-items-start">
                        <RiUser5Line size={40} />
                    </div>
                    <div className='text-sm grow shadow-lg border propse lg:prose-xl border-gray-200 rounded-md px-3  bg-gray-100/50 text-base mychat  scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md userprompt' style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', wordWrap: 'break-word', paddingTop:"1.2em", paddingBottom: "1.2em"}}>
                        {props.message.content}
                    </div>
                    <div style={{minWidth:40}}></div>
                </div>
           </div>           
          );
    }
    else{
        const result = await MarkdowntoReact(props.message.content);
        return (
            <div className={'flex align-center px-4  w-11/12 mx-auto  ' + fontCls}>
                <div className='flex mx-auto grow mb-4 '>
                    <div style={{minWidth:40}}></div>
                    <div style={{maxWidth: 'none'}} className='text-sm flex flex-col items-start grow shadow-lg px-3 border border-gray-200 rounded-md  bg-gray-100/50 prose lg:prose-xl mychat  scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md'>
                        <TypeWriterEffect root={result} idx={props.idx} scroll={props.scroll} localeStr={props.localeStr}/>
                        </div>
                    <div className='flex align-center ml-8 justify-items-end'>
                        <BsRobot size={40} />
                    </div>
                </div>
           </div>           
          );

    }

    

}