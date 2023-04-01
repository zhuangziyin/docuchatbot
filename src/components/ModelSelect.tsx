import React, { useImperativeHandle } from "react";
import { HiLightBulb } from "react-icons/hi";
import { BsLightningFill } from "react-icons/bs";
export interface LevelSelectorRef {
  GetModel: () => string;
}
type Props = {
  isSuper: boolean;
};
const Component = React.forwardRef<LevelSelectorRef, Props>((props, ref) => {
  const [level, setLevel] = React.useState<string>("gpt-3.5-turbo");
  const [showing, setshowing] = React.useState<boolean>(false);
  useImperativeHandle(ref, () => ({
    GetModel: () => level,
  }));
  if (props.isSuper) {
    return (
      <div className="absolute ml-12 flex flex-col text-sm transition-all ">
        <button
          data-dropdown-toggle="dropdown"
          className={
            (showing ? "rounded-b-none" : "") +
            " px-4 py-3 flex rounded-lg justify-center cursor-pointer hover:bg-slate-100 bg-slate-100/50 "
          }
          type="button"
          onClick={() => {
            setshowing(true);
          }}
        >
          {level == "gpt-4" ? (
            <HiLightBulb size={20} className="mr-2  text-amber-600" />
          ) : (
            <BsLightningFill size={20} className="mr-2 text-amber-500" />
          )}
          <span
            className={level == "gpt-4" ? "text-amber-600" : "text-amber-500"}
          >
            {level.toUpperCase()}
          </span>
        </button>
        <div
          className={
            "z-10 bg-slate-100/50 rounded-b-lg " + (showing ? "" : "hidden")
          }
        >
          <ul
            className="text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li
              className="flex items-center px-4 py-4 hover:bg-slate-100 cursor-pointer text-amber-600"
              onClick={() => {
                setLevel("gpt-4");
                setshowing(false);
              }}
            >
              <HiLightBulb size={20} className="mr-2  " />
              <span>GPT-4</span>
            </li>
            <li
              className="text-sm flex items-center px-4 py-4 hover:bg-slate-100 cursor-pointer rounded-b-lg text-amber-500"
              onClick={() => {
                setLevel("gpt-3.5-turbo");
                setshowing(false);
              }}
            >
              <BsLightningFill size={20} className="mr-2 " />
              <span>GPT-3.5-TURBO</span>
            </li>
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div className="absolute ml-12 flex flex-col text-sm transition-all ">
        <button
          data-dropdown-toggle="dropdown"
          className={
            (showing ? "rounded-b-none" : "") +
            " px-4 py-3 flex rounded-lg justify-center cursor-pointer hover:bg-slate-100 bg-slate-100/50 "
          }
          type="button"
          onClick={() => {
            setshowing(true);
          }}
        >
          {level == "gpt-4" ? (
            <HiLightBulb size={20} className="mr-2  text-amber-600" />
          ) : (
            <BsLightningFill size={20} className="mr-2 text-amber-500" />
          )}
          <span
            className={level == "gpt-4" ? "text-amber-600" : "text-amber-500"}
          >
            {level.toUpperCase()}
          </span>
        </button>
        <div
          className={
            "z-10 bg-slate-100/50 rounded-b-lg " + (showing ? "" : "hidden")
          }
        >
          <ul
            className="text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li
              className="flex items-center px-4 py-4 cursor-not-allowed bg-gray-300 text-amber-600"
              onClick={() => {
                setshowing(false);
              }}
            >
              <HiLightBulb size={20} className="mr-2  " />
              <span>GPT-4</span>
            </li>
            <li
              className="text-sm flex items-center px-4 py-4 hover:bg-slate-100 cursor-pointer rounded-b-lg text-amber-500"
              onClick={() => {
                setLevel("gpt-3.5-turbo");
                setshowing(false);
              }}
            >
              <BsLightningFill size={20} className="mr-2 " />
              <span>GPT-3.5-TURBO</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
export default Component;

Component.displayName = "LevelSelector";
