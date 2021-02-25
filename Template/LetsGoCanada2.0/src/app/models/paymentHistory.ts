export class PaymentHistory {

    public id?: number;
    public paymentId?: number;
    public previousState?: number;
    public currentState?: number;
    public date?: Date;
    public loginId?: number;
    public actions?: string;

    constructor() { }
}