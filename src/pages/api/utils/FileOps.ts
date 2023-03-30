import fs from 'fs';
import { S3Client, AbortMultipartUploadCommand, PutObjectCommand, GetObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
export interface FileOps{
    SaveFile: (path: string, content: Buffer) => Promise<boolean>;
    ReadFile: (path: string) => Promise<Buffer | null>;
    DeleteFile: (path: string) => Promise<boolean>;
    CreateFolder: (path: string) => Promise<boolean>;
    DeleteFolder: (path: string) => Promise<boolean>;
    GetAllFiles:(path: string)   => Promise<string[]>;
}
export class FileOpsLocal implements FileOps {
    async SaveFile(path: string, content: Buffer): Promise<boolean> {

        // Check if directory of file exists, create it if it doesn't
        const dir = path.substring(0, path.lastIndexOf('/'));
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
    
        try {
          await fs.promises.writeFile(path, content, { flag: 'w+', encoding: 'utf-8' });
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      }
  
    async ReadFile(path: string): Promise<Buffer | null> {
      if(!fs.existsSync(path))
      {
        return null;
      }
      else{
        let content = await fs.readFileSync(path);
        return content;
      }
    }
  
    async DeleteFile(path: string): Promise<boolean> {
      // implementation for DeleteFile method
      if(fs.existsSync(path)){
        fs.unlinkSync(path);
      }
      return true;
    }
  
    async CreateFolder(path: string): Promise<boolean> {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
          }
      return true;
    }
    deleteFolderRecursive(path: string) {
        if (fs.existsSync(path)) {
          fs.readdirSync(path).forEach((file, index) => {
            const curPath = `${path}/${file}`;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
              this.deleteFolderRecursive(curPath);
            } else { // delete file
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(path);
        }
      }
  
    async DeleteFolder(path: string): Promise<boolean> {
      // implementation for DeleteFolder method
      this.deleteFolderRecursive(path);
      return true;
    }
    async GetAllFiles(path: string): Promise<string[]> {
        return [];
    }
  }


  export class FileOpsDigital implements FileOps{
    s3Client: S3Client;
    constructor(){
        this.s3Client = new S3Client({
            endpoint: process.env.ENDPOINT, // Find your endpoint in the control panel, under Settings. Prepend "https://".
            forcePathStyle: false, // Configures to use subdomain/virtual calling format.
            region: process.env.REGION, // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
            credentials: {
            accessKeyId: process.env.ACCESSKEY!, // Access key pair. You can create access key pairs using the control panel or API.
            secretAccessKey: process.env.SECRETKEY! // Secret access key defined through an environment variable.
            }
        });
    }
      
    streamToString(stream: NodeJS.ReadableStream): Promise<string> {
        const chunks: Array<Buffer> = [];
        return new Promise((resolve, reject) => {
          stream.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
          stream.on('error', (err: Error) => reject(err));
          stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        });
      };
      
    async SaveFile(path: string, content: Buffer): Promise<boolean> {        
        const params = {
            Bucket: process.env.BUCKET, // The path to the directory you want to upload the object to, starting with your Space name.
            Key:path, // Object key, referenced whenever you want to access this file later.
            Body: content, // The object's contents. This variable is an object, not a string.
            ACL: "private", // Defines ACL permissions, such as private or public.
        };
        await this.s3Client.send(new PutObjectCommand(params));
        return true
      }
  
    async ReadFile(path: string): Promise<Buffer | null> {
        
    const bucketParams = {
        Bucket: process.env.BUCKET,
        Key: path
    };
    try{
        const response = await this.s3Client.send(new GetObjectCommand(bucketParams));
    const data = await response.Body?.transformToByteArray();
    return data ? Buffer.from(data) : null;
    }
    catch(err){
        return null;
    }
    
   

    }
  
    async DeleteFile(path: string): Promise<boolean> {
      // implementation for DeleteFile method
      if(fs.existsSync(path)){
        fs.unlinkSync(path);
      }
      return true;
    }
  
    async CreateFolder(path: string): Promise<boolean> {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
          }
      return true;
    }
    deleteFolderRecursive(path: string) {
        if (fs.existsSync(path)) {
          fs.readdirSync(path).forEach((file, index) => {
            const curPath = `${path}/${file}`;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
              this.deleteFolderRecursive(curPath);
            } else { // delete file
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(path);
        }
      }
  
    async DeleteFolder(path: string): Promise<boolean> {
      // implementation for DeleteFolder method
      this.deleteFolderRecursive(path);
      return true;
    }
    async GetAllFiles(path: string): Promise<string[]> {
        const bucketParams = { Bucket: process.env.BUCKET };
        const data = await this.s3Client.send(new ListObjectsCommand(bucketParams));
        console.log(data)
        return [];
    }

  }

const FileOpInstance : FileOps = process.env.USELOCALFILE === "true" ? new FileOpsLocal() : new FileOpsDigital();
export default FileOpInstance;