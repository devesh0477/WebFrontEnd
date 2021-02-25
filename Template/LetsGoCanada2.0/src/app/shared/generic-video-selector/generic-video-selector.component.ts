import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoObj } from 'src/app/models/videoObj';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-generic-video-selector',
  templateUrl: './generic-video-selector.component.html',
  styleUrls: ['./generic-video-selector.component.css']
})
export class GenericVideoSelectorComponent implements OnInit {

  public videoUrl: Array<VideoObj> = [];
  public videoLinkSanitized: SafeResourceUrl;
  @Input() info: VideoObj;

  public width: number;
  public height: number;

  constructor(private sanitizer: DomSanitizer, private service: GeneralService) { }

  ngOnInit() {
    this.showVideo(this.info);
    this.width = this.info.width;
    this.height = this.info.height;
  }

  /**
   * @param school 
   * @author Deivid Mafra
   * @date 12/05/2020.
   */
  showVideo = (info: VideoObj) => {
    this.videoUrl = [];

    console.log(info)
    let url: string = info.url + info.mediaId;

    this.service.getService(url).subscribe(
      res => {
        if (res.data[0]) {
          for (let i = 0; i < res.data.length; i++) {
            this.videoLinkSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(res.data[i].mediaLocation);
            let videoObj = new VideoObj();
            videoObj.mediaId = res.data[i].programMediaId;
            videoObj.mediaUrl = this.videoLinkSanitized;
            this.videoUrl.push(videoObj);
          }
        }
      },
      error => {
        console.log('error', error)
      }
    )
  }

}
