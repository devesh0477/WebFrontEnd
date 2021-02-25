import { SafeResourceUrl } from "@angular/platform-browser";

export class VideoObj {

    mediaId: number;
    mediaUrl?: SafeResourceUrl;
    url?: string;
    width?: number;
    height?: number;

    constructor() { }
}