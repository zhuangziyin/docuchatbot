import { cut } from "@node-rs/jieba";
import { NextApiRequest, NextApiResponse } from "next";
interface OneTimeAppend {
  value: string;
  wait: number;
}
export const split = (text: string): OneTimeAppend[] => {
  if (!text) {
    return [];
  }
  var finalList: OneTimeAppend[] = [];
  try {
    const wordList = cut(text);

    for (var i in wordList) {
      if (wordList[i].length > 4) {
        var tmpIdx = 0;
        while (tmpIdx < wordList[i].length) {
          finalList.push({
            value: wordList[i].substring(
              tmpIdx,
              Math.min(tmpIdx + 2, wordList[i].length)
            ),
            wait: 20,
          });
          tmpIdx += 2;
        }
      } else {
        finalList.push({ value: wordList[i], wait: 60 });
      }
    }
  } catch (error) {}
  return finalList;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { text } = req.body;

  if (!text) {
    res.status(400).json({ error: "Bad Request: missing 'text' parameter" });
    return;
  }

  try {
    const wordList = cut(text);
    var finalList: OneTimeAppend[] = [];
    for (var i in wordList) {
      if (wordList[i].length > 4) {
        var tmpIdx = 0;
        while (tmpIdx < wordList[i].length) {
          finalList.push({
            value: wordList[i].substring(
              tmpIdx,
              Math.min(tmpIdx + 2, wordList[i].length)
            ),
            wait: 20,
          });
          tmpIdx += 2;
        }
      } else {
        finalList.push({ value: wordList[i], wait: 60 });
      }
    }
    res.status(200).json({ finalList });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
