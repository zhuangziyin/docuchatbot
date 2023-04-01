import { localeToFontCls } from "../../utils/fontCls";
import { useEffect, useState, useTransition } from "react";
import { BsRobot } from "react-icons/bs";
import { useTranslation, UseTranslation } from "next-i18next";
function WaitingLbl(props: { localeStr: string }) {
  const { t } = useTranslation("chat");

  const [num, setNumber] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setNumber((num + 1) % 4);
    }, 300);
  }, [num]);
  function getDots() {
    let res = "";
    for (var i = 0; i < num; i++) res += ".";

    return res;
  }
  return (
    <div className="mb-4 w-fit mx-auto">
      <div
        className={
          "bg-blue-200/30  border border-blue-500 shadow-lg mb-2 text-blue-500 px-4 py-2 text-sm rounded-md mx-auto flex items-center justify-center  " +
          localeToFontCls(props.localeStr, "heavy")
        }
      >
        <div className="flex align-center justify-items-end mr-2">
          <BsRobot size={40} />
        </div>
        <span>
          {t("GenerateHint")} {getDots()}
        </span>
      </div>
    </div>
  );
}
export default WaitingLbl;
