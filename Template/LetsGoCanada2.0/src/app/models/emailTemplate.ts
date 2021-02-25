export class EmailTemplate {

    emailTemplateId?: number;
    name: string;
    template: string;
    dtCreated: Date;
    dtModified: Date;
    lastUserModified: number;
    subject: string;
    workflowProcessMessageContent: number;

    constructor() { }
}