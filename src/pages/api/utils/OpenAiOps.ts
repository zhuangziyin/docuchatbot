
import axios, {AxiosRequestConfig} from 'axios';

export interface ChatMessageModel {
    role: string;
    content:  string;
}

export async function callOpenAI(msgs: ChatMessageModel[], model: string): Promise<any> {
    const apiKey = process.env.OPENAIAPI;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    try{
        const config: AxiosRequestConfig = {
            method: 'post',
            url: apiUrl,
            responseType: 'stream',
            headers: { 'Authorization': `Bearer ${apiKey}` },
            data: { model: model, messages: msgs, temperature: 0.8, stream: true }
          };

          const response = await axios(config);
          return response.data
            

    }
    catch(err){
        console.log(err);
        return null;
    }
    
  }
  