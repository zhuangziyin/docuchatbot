import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useTranslation } from "next-i18next";
import { localeToFontCls } from "@/utils/fontCls";
import { AiOutlineCheck } from "react-icons/ai";
import { BsPersonWorkspace } from "react-icons/bs";
import FileSidebarItem from "./FileSidebarItem";
import FileSidebarSelectedItem from "./FileSidebarSelectedItem";
import { useEffect, useState } from "react";
import { SideBarCls } from "./SidebarBasicCls";
import { signOut } from "next-auth/react";
import FileUploader from "./FileUploader";
function FileSidebar(props: {
  localeStr: string;
  files: string[];
  userName: string;
}) {
  const [selectedFiles, setSelectedFiles] = useState<{ [id: string]: boolean }>(
    {}
  );
  const [selectedItems, setSelectedItems] = useState<JSX.Element[]>([]);
  const { t } = useTranslation("chat");
  const items = props.files.map((file, index) => {
    return (
      <FileSidebarItem
        name={file}
        id={index}
        key={index.toString()}
        click={selectFile}
      />
    );
  });
  useEffect(() => {
    var selectedIds = Object.keys(selectedFiles).filter(
      (id) => selectedFiles[id]
    );
    console.log(selectedIds);
    var newSelectedItems = selectedIds.map((id) => {
      return (
        <FileSidebarSelectedItem
          name={props.files[parseInt(id)]}
          id={parseInt(id)}
          key={"selected " + id.toString()}
          click={removeFile}
        />
      );
    });
    setSelectedItems(newSelectedItems);
  }, [selectedFiles]);
  function selectFile(id: number) {
    selectedFiles[id.toString()] = true;
    setSelectedFiles(JSON.parse(JSON.stringify(selectedFiles)));
  }
  function removeFile(id: number) {
    selectedFiles[id.toString()] = false;
    setSelectedFiles(JSON.parse(JSON.stringify(selectedFiles)));
  }

  return (
    <div
      className={
        "w-64 bg-slate-50/80 h-full flex flex-col text-sm " +
        localeToFontCls(props.localeStr, "regular")
      }
    >
      <div className="relative flex flex-col flex-1 min-h-0">
        <div className={SideBarCls.SideBarLbl}>
          <AiOutlineCheck size={16} className="mr-3" /> {t("FileSelected")}
        </div>
        <div className="max-h-44 overflow-y-auto">{selectedItems}</div>
        <div className={SideBarCls.SideBarLbl}>
          <BsPersonWorkspace size={16} className="mr-3" />
          <span>{props.userName + " " + t("WorkSpace")} </span>
        </div>
        <div className="pb-2 flex flex-col min-h-0">
          <div className="flex flex-col  min-h-0 overflow-y-auto">{items}</div>
        </div>
      </div>
      <div className="relative border-t-slate-200 border-solid border-t">
        <FileUploader />
        <div className={SideBarCls.SideBarBtm}>
          <RiDeleteBin6Line size={SideBarCls.IconSize} className="mr-3" />
          <span>{t("ClearConversation")}</span>
        </div>
        <div
          className={SideBarCls.SideBarBtm}
          onClick={() => {
            signOut();
          }}
        >
          <MdLogout size={SideBarCls.IconSize} className="mr-3" />
          <span>{t("Logout")}</span>
        </div>
      </div>
    </div>
  );
}

export default FileSidebar;
