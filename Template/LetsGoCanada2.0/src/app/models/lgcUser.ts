import { LgcPersonal } from "./lgcPersonal";

export class LgcUser {

    public loginId?: number;
    public firstName?: string;
    public lastName?: string;
    public roleName?: string;
    public roleId?: number;
    public email: string;
    public password?: string;
    public lgcpersonal?: LgcPersonal;
    public active?:boolean;

    constructor() { }
}