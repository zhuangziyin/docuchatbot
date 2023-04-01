// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ChatMessageModel, callOpenAI } from "@/pages/api/utils/OpenAiOps";
import { sleep } from "@/utils/Utils";
type Data = ChatMessageModel[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    res.setHeader("Content-Type", "application/octet-stream");
    const question = JSON.parse(req.body) as {
      msgs: ChatMessageModel[];
      model: string;
    };
    var response = await callOpenAI(question.msgs, question.model);
    // await sleep(3000);
    // res.write('ERROR: '); // Send the error message within the octet-stream
    // res.end(); // Don't forget to close the stream
    // //res.useStream();
    response.pipe(res);

    // End the response when the stream finishes
    response.on("end", () => {
      res.end();
    });

    // Handle streaming errors
    response.on("error", (err: Error) => {
      console.error("Error while streaming the response:", err);
      res.write("ERROR: " + err.message); // Send the error message within the octet-stream
      res.end(); // Don't forget to close the stream
    });
  } catch (err) {
    console.log(err);
    res.write("ERROR: "); // Send the error message within the octet-stream
    res.end(); // Don't forget to close the stream
  }
}
