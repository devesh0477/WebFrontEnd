export class Documento {
    
    public typeDoc?: string;
    public id?: number;
    public applicantId?: number;
    public documentDescription?: string;
    public documentLocation?: string;
    public documentName?: string;
    public uploaded?: boolean;
    public indications?: string;

    //public docId?: string;
    //public docName?: string;
    public doctype?: string;
    public file?: File;
    
    constructor() {}
}