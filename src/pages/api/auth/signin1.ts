import { cut } from "@node-rs/jieba";
import { NextApiRequest, NextApiResponse } from 'next';
import { User, readUsers, createFolder, writerUser } from "./[...nextauth]"
interface OneTimeAppend{
    value: string;
    wait: number;
  
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const user = req.body as User;

  
  if(!user.password){
    res.status(400).json({ error: "Bad Request: missing 'password'" });
    return;
    }
    if(!user.name){
    res.status(400).json({ error: "Bad Request: missing 'name'" });
    return;
    }

  try {
    await createFolder();
    let users = await readUsers();
    const userExist = users.findIndex(x=> x.password == user.password && x.name == user.name);
    if(userExist == -1){
        users.push(user);
    }
    else{
        users[userExist].email = user.email;
        users[userExist].password = user.password;
        users[userExist].name = user.name;
    }
    await writerUser(users);
    res.status(200).json("OK");
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
