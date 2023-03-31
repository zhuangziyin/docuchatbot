import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";
import rehypeHighlight from "rehype-highlight";
import { createElement, Fragment } from "react";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import stringfy from "rehype-stringify";
import { Root, Text, Element, RootContent } from "hast";
import remarkGfm from "remark-gfm";
import { io } from "socket.io-client";
import { Socket } from "socket.io";

interface Ref<T> {
  value: T;
}

interface Node {
  type: string;
  properties?: {
    className?: string[];
  };
  children?: Array<Node | string>;
  value?: string;
}

export interface OneTimeAppend{
  value: string;
  wait: number;

}
export const split = (text:string) : OneTimeAppend[] =>{
  var finalList = [];
  var wordList = text.split(/(\s+)/);
  for(var i in wordList){
  if(wordList[i].length > 4){
    var tmpIdx = 0;
    while(tmpIdx < wordList[i].length){
      finalList.push({value: wordList[i].substring(tmpIdx, Math.min(tmpIdx + 2, wordList[i].length)), wait: 120});
      tmpIdx += 2;
    }
    
  }
  else{
    finalList.push({value: (wordList[i]), wait: 200});
  }
}
return finalList;
}
async function segmentText(text: string, socket: Socket) : Promise<OneTimeAppend[]> {
  if(text !== "" && text !== undefined && text !== null){
    const response1 : OneTimeAppend[] = await new Promise((resolve) => {
      socket.emit('split', text, (response : OneTimeAppend[]) => {
        resolve(response);
      });
    });
    return response1;
  }
  return [];
  
}

async function splitShowContent(text: string, localeStr: string, socket: Socket) : Promise<OneTimeAppend[]> {
  var finalList: OneTimeAppend[] = [];
  if(localeStr == "en-US"){
    var wordList = text.split(/(?=d)/g);
    
    for(var i in wordList){
    if(wordList[i].length > 4){
      var tmpIdx = 0;
      while(tmpIdx < wordList[i].length){
        finalList.push({value: wordList[i].substring(tmpIdx, Math.min(tmpIdx + 2, wordList[i].length)), wait: 40});
        tmpIdx += 2;
      }
      
    }
    else if(wordList[i] == " "){
      finalList.push({value: (wordList[i]), wait: 200});
    }
    else{
      finalList.push({value: (wordList[i]), wait: 200});
    }
  }
}
  else{
    finalList = await segmentText(text, socket);
    // const wordList = cutAll(text);
    // for(var i in wordList){
    //   if(wordList[i].length > 4){
    //     var tmpIdx = 0;
    //     while(tmpIdx < wordList[i].length){
    //       finalList.push({value: wordList[i].substring(tmpIdx, Math.min(tmpIdx + 2, wordList[i].length)), wait: 40});
    //       tmpIdx += 2;
    //     }
        
    //   }
    //   else{
    //     finalList.push({value: (wordList[i]), wait: 150});
    //   }
    // }

  }
  return finalList;
  
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function getOuterHtml(root: RootContent): string {
  if (root.type === "element") {
    const element = root as Element;
    const tag = element.tagName.toLowerCase();
    const attributes = Object.keys(element.properties ?? {})
      .map((key) => `${key}="${element.properties?.[key]}"`)
      .join(" ");
    return `<${tag}${attributes ? " " + attributes : ""}>`;
  } else return "";
}
export async function StartTraverse(
  root: Root,
  appenFunc: (str: string) => void, localeStr: string
) {

  const socket = io("/", { path: "/api/socket"});
  socket.on("connect", async () => {  
    console.log("connected");
    var curRoot: Root = { type: "root", children: [] };
  async function printRoot() {
    var contentStr = await unified()
      .use(rehypeParse)
      .use(stringfy)
      .stringify(curRoot);
    appenFunc(contentStr);
  }
  for (const child of root.children) {
    await traverse(child, curRoot, GetOuterHtmlRootContent, printRoot, localeStr, socket);
  }

  });
  
}



async function traverse(
  node: RootContent,
  fatherNode: Element | Root,
  callback: (node: Element) => Promise<Element>,
  printRoot: () => Promise<void>,
  localeStr: string, socket: Socket | any
): Promise<Element | null> {
  if (node.type == "element") {
    const curRoot = await callback(node as Element);
    fatherNode.children.push(curRoot);
    for (const child of node.children!) {
      await traverse(child, curRoot, callback, printRoot, localeStr, socket);
    }
    return curRoot;
  } else {
    var curIdx = fatherNode.children.length;
    const textNode = node as Text;
    var text = textNode.value.toString();
    var idx = 0;
    textNode.value = "";
    fatherNode.children.push(textNode);
    var finalList = await splitShowContent(text, localeStr, socket);
    console.log(finalList);
    for(var i in finalList){
      (fatherNode.children[curIdx] as Text).value += finalList[i].value;
      await printRoot();
      //console.log(finalList[i].value);
      await sleep(finalList[i].wait);
    }
    return null;
  }
}

export const GetOuterHtmlRootContent = async (
  root: Element
): Promise<Element> => {
  const outerHtml = getOuterHtml(root);
  const ele = await unified()
    .use(rehypeParse, { fragment: true })
    .parse(outerHtml);
  return ele.children[0] as Element;
};

export const MarkdowntoReact = async (markdown: string): Promise<string> => {
  //const content = await (await remark().use(html).process(markdown)).toString();
  const content = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeHighlight, { detect: true })
    .use(rehypeReact, { createElement, Fragment })
    .use(stringfy)
    .process(markdown);
  return content.value.toString();
};
