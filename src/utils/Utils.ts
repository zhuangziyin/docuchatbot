import crypto from 'crypto';

export function encrypt(text: string){

    const hash = crypto.createHash('sha256')
    hash.update(text)
    const hashString = hash.digest('hex')
    return hashString;
}