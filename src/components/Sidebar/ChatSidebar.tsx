import {MdLogout} from 'react-icons/md'
import {RiDeleteBin6Line} from 'react-icons/ri'
import { useTranslation } from 'next-i18next'
import { localeToFontCls } from '@/utils/fontCls'
import { SideBarCls } from './SidebarBasicCls'
import {BiMessageAdd} from  "react-icons/bi"
import { signOut } from 'next-auth/react'
function ChatSidebar(props:{localeStr: string, chats:string[]}) {
    const { t } = useTranslation('chat');
    
    
    return(
        <div className={"w-64 bg-slate-50/80 h-full flex flex-col text-sm " + localeToFontCls(props.localeStr, "regular")}>
            <div className={SideBarCls.ChatSidebarItm}>
                <BiMessageAdd size={SideBarCls.IconSize}  className="mr-3"/>
                <span>{t("NewChat")}</span></div>
            <div className='relative flex flex-col flex-1 min-h-0'>
                
                
            </div>
            <div className='relative border-t-slate-200 border-solid border-t'>
                <div className={SideBarCls.SideBarBtm}>
                <RiDeleteBin6Line size={SideBarCls.IconSize} className="mr-3"/>
                <span>{t("ClearConversation")}</span>
                </div>
                <div className={SideBarCls.SideBarBtm} onClick={() => {signOut();}} >
                <MdLogout size={SideBarCls.IconSize}  className="mr-3"/>
                <span>{t("Logout")}</span>
                </div>
            </div>

        </div>);
}

export default ChatSidebar;