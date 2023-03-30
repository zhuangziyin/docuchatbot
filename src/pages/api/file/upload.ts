// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import FileOps from '../utils/FileOps'

type Data = {
  path: string
  content: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const path = (req.body as Data).path;
    console.log(path);
    try{
        var allFiles = await FileOps.GetAllFiles("/");
        
        var content = await FileOps.ReadFile("a/file.txt")
        console.log(content?.toString("utf8"))
        
        var newContent = await FileOps.SaveFile("a/file.txt", Buffer.from(content +"\n Hey world!", 'utf8'));
        var getAgain = await FileOps.ReadFile("a/file.txt")
        console.log(getAgain?.toString("utf8"))
        
        // let getResponse = await spaces.getObject({bucket, key});

        // console.log(`get status: ${getResponse.status}`)
        // console.log(`get response body: '${await getResponse.text()}'`)

        // let delResponse = await spaces.deleteObject({bucket, key});

        // console.log(`del status: ${delResponse.status}`)
        // console.log(`del response body: '${await delResponse.text()}'`)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
    res.status(200).json({ name: 'John Doe' })
}
