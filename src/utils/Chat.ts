import { ChatMessage } from "@/components/ChatBox/ChatBox";
import { MarkdowntoReact } from "@/MarkdownProcessor";
import { callbackify } from "util";
import { sleep } from "./Utils";
export async function ChatCompletion(
  curMsgs: any,
  model: string,
  callBackFunc: ((str: string) => void) | undefined,
  errCallbakc: (() => void) | undefined,
  finshiehdCallback: (() => void) | undefined
) {
  const response = await fetch("/api/chat/completion", {
    body: JSON.stringify({
      msgs: curMsgs,
      model: model,
    }),
    method: "POST",
  });
  if (!response.ok) {
    errCallbakc?.();
    return;
  }
  const stream = await response.body;
  if (stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder("utf-8");
    let markDown: string = "";
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        finshiehdCallback?.();
        break;
      }
      //res += JSON.parse(decoder.decode(value)).choices[0].delta.content
      let res: string[] = decoder.decode(value).split("\n");
      for (var i in res) {
        var strContent = res[i].trim();
        if (strContent !== "") {
          try {
            let ele = JSON.parse(res[i].replace(/^data: /, "")).choices[0].delta
              .content;
            if (ele) {
              markDown += ele;
              var htmlTxt = await MarkdowntoReact(markDown);
              callBackFunc?.(htmlTxt);
            }
          } catch (err) {
            if (res[i].startsWith("ERROR:")) {
              errCallbakc?.();
            }
          }
        }
      }
    }
  }
}
