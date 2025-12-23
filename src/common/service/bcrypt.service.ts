import bcrypt from 'bcrypt';
import {injectable} from "inversify";

@injectable()
export class HashService {


    async hashMaker(pass: string): Promise<string> {
        return await bcrypt.hash(pass, 10)
    }

    async compareHash(pass: string, hash: string): Promise<boolean> {
        return bcrypt.compare(pass, hash)
    }
}
