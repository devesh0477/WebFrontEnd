import { ChildrenItems } from "./childrenItems";

export class RouterInfo {

    public path: string;
    public title: string;
    public type: string;
    public icontype: string;
    public collapse?: string;
    public children?: Array<ChildrenItems>;

    constructor() {}
}