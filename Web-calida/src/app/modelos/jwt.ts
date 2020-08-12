import { User } from "./User";

export interface Jwt
{
    user:User,
    log:boolean,
    name:string
    error:boolean,
    status:string,
    token:string,
    id_inver:number,
}