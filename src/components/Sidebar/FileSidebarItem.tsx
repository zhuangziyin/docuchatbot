import { ImFilePdf } from "react-icons/im";
import { SideBarCls } from "./SidebarBasicCls";
function FileSidebarItem(props: {
  name: string;
  id: number;
  click: (id: number) => void;
}) {
  return (
    <div
      className="pr-2 pl-1 py-3 flex justify-start items-center cursor-pointer hover:bg-slate-300/50 transition-all"
      onClick={() => props.click(props.id)}
    >
      <div className="w-4 mr-2"></div>
      <ImFilePdf size={SideBarCls.IconSize} className="mr-2" />
      <span>{props.name}</span>
    </div>
  );
}
export default FileSidebarItem;
