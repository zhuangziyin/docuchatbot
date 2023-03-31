// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatMessageModel, callOpenAI } from '@/pages/api/utils/OpenAiOps';

type Data = ChatMessageModel[]



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    try{
        const question = JSON.parse(req.body) as
        {
          msgs:ChatMessageModel[],
          model:string
        }
        
        var response = await callOpenAI(question.msgs, question.model);

        res.setHeader('Content-Type', 'application/octet-stream');
        //res.useStream();
        response.pipe(res);
    // End the response when the stream finishes
        response.on('end', () => {
          res.end();
        });

    // Handle streaming errors
        response.on('error', (err: Error) => {
          console.error('Error while streaming the response:', err);
          res.status(500).json({ error: err.message });
        });
        
    }
    catch(err){
      console.log(err)
      res.status(500).json(err)
    }
    
}
