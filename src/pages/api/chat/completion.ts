// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAIAPI,
});

interface ChatMessageModel {
    role: string;
    content:  string;
}

type Data = ChatMessageModel[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    try{
        const question = JSON.parse(req.body) as Data;
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: question,
      });
    res.status(200).json(response.data.choices[0].message)

    }
    catch(err){
        res.status(500).json(err)
    }
    
}
