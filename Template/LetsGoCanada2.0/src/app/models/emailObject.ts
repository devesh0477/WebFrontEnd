export class EmailObject {

    public message: string;
    public addresseeList: Array<string>; //This can be eihter Email addresses or phone numbers
    public subject: string;
    public isHtml: boolean;
    public email: boolean;
    public SMS: boolean;

    constructor() {}
}