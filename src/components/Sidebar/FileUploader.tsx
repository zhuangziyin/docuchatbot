import { SideBarCls } from "./SidebarBasicCls";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useRef } from "react";
function FileSidebarItem() {
  const router = useRouter();
  const { t } = useTranslation("chat");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    if (event.target.files) {
      const filesArray = Array.from(event.target.files || []);
      // Filter the files to only keep the ones that are of type PDF
      const pdfFilesArray = filesArray.filter(
        (file) => file.type === "application/pdf"
      );
      pdfFilesArray.forEach((file) => {
        formData.append("files", file);
        console.log(file);
      });
      //   fetch('/api/upload', {
      //     method: 'POST',
      //     body: formData,
      //   })
      //     .then((response) => response.json())
      //     .then((data) => {
      //       console.log(data);
      //       router.reload();
      //     })
      //     .catch((error) => {
      //       console.error(error);
      //     });
    }
  };
  const handleSelectButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <div
      className="px-4 py-4 flex justify-start items-center cursor-pointer hover:bg-slate-300/50 transition-all"
      onClick={handleSelectButtonClick}
    >
      <AiOutlineCloudUpload size={SideBarCls.IconSize} className="mr-3" />
      <span>{t("UploadFile")}</span>
      <input
        type="file"
        multiple
        onChange={handleFileUpload}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
    </div>
  );
}
export default FileSidebarItem;
