import { AiOutlineClose } from "react-icons/ai";
import { ImFilePdf } from "react-icons/im";
import { SideBarCls } from "./SidebarBasicCls";
function FileSidebarSelectedItem(props: {
  name: string;
  id: number;
  click: (id: number) => void;
}) {
  return (
    <div
      className="group pr-2 pl-2 py-3 flex justify-start items-center cursor-pointer bg-slate-300/50 border-0 "
      onClick={() => props.click(props.id)}
    >
      <AiOutlineClose
        size={SideBarCls.IconSize}
        className="mr-1 flex justify-center group-hover:opacity-100 opacity-0 transition-all"
      />
      <ImFilePdf size={SideBarCls.IconSize} className="mr-2" />
      <span>{props.name}</span>
    </div>
  );
}
export default FileSidebarSelectedItem;
