import { Campus } from 'src/app/models/campus';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { ActivatedRoute } from '@angular/router';
import { showNotification } from 'src/app/toast-message/toast-message';
import { ComunicationService } from 'src/app/services/comunication.service';
import { VideoObj } from 'src/app/models/videoObj';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.css']
})
export class CampusComponent implements OnInit {

  tableHeader: string[] = ['Campus Name', 'City', 'Country', 'Edit'];

  public campusList: Array<Campus>;
  public newCampusList: Array<Campus>;
  public pageOfItems: Array<Campus>;
  public selectedCampus: Campus;
  public cityList: Array<any>;
  private cityName: Array<any>;
  public countryList: Array<any>;
  public provinceList: Array<any>;
  private countryName: Array<any>;

  public campusMedia: string;
  public campusId;

  public schoolIdTest;

  @ViewChild('videoUrlForm') formValues;
  private campusIdForVideo: number;
  public videoLinkSanitized: SafeResourceUrl;
  public videoUrl: Array<VideoObj> = [];
  public campusNameForVideo: string;
  public whosWorking: string = '';

  constructor(private campusService: GeneralService,
    private route: ActivatedRoute,
    private sendSchoolId: ComunicationService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getCampusList();
    this.getCityList();
    this.getProvinceList();
    this.getCountryList();


  }

  /**
   * Method to define the accion to show the spinner.
   * @param paramet 
   * @author Diego.Perez
   * @date 12/14/2020
   */
  onPopUpDoing(paramet: string) {
    if (!isNullOrUndefined(paramet) && paramet == this.whosWorking) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @author Deivid Mafra;
   * @date 06/08/2020;
   * @param campus - is a complete campus object;
   * @remarks This method is responsible for allowing the end-user select a campus to edit by clicking on that in the table.
   */
  selectCampus(campus: Campus) {
    this.selectedCampus = campus;
    console.log(">>>", this.selectedCampus);
  }

  /**
   * @author Deivid Mafra;
   * @date 06/08/2020;
   * @remarks This method is responsible for loading the campus list from the back-end
   */
  getCampusList() {
    // let url: string = '/school/getCampusList/' + this.getSchoolId();
    this.getSchoolId()
    let url: string = '/school/getCampusList/' + this.schoolIdTest;
    this.campusService.getService(url).subscribe(
      (res) => {
        this.campusList = res.data.sort();
        // console.log("this.campusList>>>>", this.campusList)
      },
      (err) => {
        console.log(err);
      });
  }

  sendCampusEdit(item) {
    // console.log(item)
    localStorage.setItem('schoolId', item.schoolId);

  }

  getSchoolId() {
    this.schoolIdTest = this.route.snapshot.paramMap.get('id');
    this.sendSchoolId.sendProcess(this.schoolIdTest);
  }

  onChangePage(pageOfItems: Array<Campus>) {
    this.pageOfItems = pageOfItems;
  }


  getCityList() {
    let url: string = '/admin/getCityList';
    this.campusService.getService(url).subscribe(
      (res) => {
        this.cityList = res.data;
        // console.log("this.cityList>>>>", this.cityList);

        (err) => {
          console.log(err);
        }
      });
  }

  getCity(cityId) {
    try {
      this.cityName = this.cityList.filter(cityList => cityList.cityId == cityId)
    } catch (error) {
      return "city name";
    }
    return this.cityName[0].name;
  }

  getCountryList() {
    let url: string = '/admin/getCountryList';
    this.campusService.getService(url).subscribe(
      (res) => {
        this.countryList = res.data;
        // console.log("this.countryList>>>>", this.countryList);

        (err) => {
          console.log(err);
        }
      });
  }


  getCountry(countryId) {
    try {
      this.countryName = this.countryList.filter(countryList => countryList.countryId == countryId)
    } catch (error) {
      return "country name";
    }
    return this.countryName[0].name;
  }

  getProvinceList() {
    let url: string = '/admin/getProvinceList';
    this.campusService.getService(url).subscribe(
      (res) => {
        this.provinceList = res.data;
        // console.log("this.provinceList>>>>", this.provinceList);

        (err) => {
          console.log(err);
        }
      });
  }

  showCampusMedia = (id) => {
    this.campusId = id;
    let url: string = '/school/getCampusByID/' + this.campusId;

    this.campusService.getService(url).subscribe(
      res => {
        if (res.data[0].campusMedia.length == 0) {
          this.campusMedia = './assets/img/image_placeholder.jpg';
        } else {
          this.campusMedia = res.data[0].campusMedia[0].mediaLocation;
        }
      },
      err => {
        console.log('err', err);
      }
    )
  }

  setCampusMedia(file: FileList) {
    console.log('event.target', event.target)
    const media = file.item(0);
    const formData = new FormData();
    formData.append('file', media);
    this.whosWorking = 'media';
    let url: string = '/School/postCampusPhoto?campusId=' + this.campusId;
    this.campusService.postFile(url, formData).subscribe(
      res => {
        if (res.message == 'Ok') {
          this.campusMedia = res.data[0].mediaLocation;
          showNotification('top', 'right', 'success', 'Campus media saved successfully.');
        }
        this.whosWorking = '';
      },
      (err) => {
        showNotification('top', 'right', 'danger', err.error.message);
        this.whosWorking = '';
      }
    )
  }

  /**
   * @param campus 
   * @author Deivid Mafra
   * @date 12/03/2020.
   */
  showVideo = (campus) => {

    this.videoUrl = [];
    this.campusIdForVideo = campus.campusId;
    this.campusNameForVideo = campus.campusName;

    let url: string = '/media/getCampusVideoURL/' + campus.campusId;

    this.campusService.getService(url).subscribe(
      res => {
        if (res.data[0]) {
          for (let i = 0; i < res.data.length; i++) {
            this.videoLinkSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(res.data[i].mediaLocation);
            let videoObj = new VideoObj();
            videoObj.mediaId = res.data[i].id;
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

  /**
   * @param videoUrlForm 
   * @author Deivid Mafra
   * @date 12/03/2020.
   */
  setVideo = ({ value }: { value: any }) => {

    let videoObject = {
      "MediaRowID": 0,
      "ResourceID": this.campusIdForVideo,
      "ResourceURL": value.videoUrl
    }

    let url: string = '/media/setCampusVideoURL';
    this.whosWorking = 'video';
    this.campusService.post(url, videoObject).subscribe(
      res => {
        if (res.message == 'Ok') {
          this.formValues.resetForm();
          this.videoLinkSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(res.data[0].mediaLocation);
          let videoObj = new VideoObj();
          videoObj.mediaId = res.data[0].campusMediaId;
          videoObj.mediaUrl = this.videoLinkSanitized;
          this.videoUrl.push(videoObj);
          showNotification('top', 'right', 'success', 'Video url saved successfully');

        } else {
          showNotification('top', 'right', 'danger', res.message);
        }
        this.whosWorking = '';
      },
      (err) => {
        console.log(err);
        this.whosWorking = '';
      }
    );
  }

  /**
   * @param mediaId 
   * @author Deivid Mafra
   * @date 12/03/2020.
   */
  deleteVideo = (mediaId: number) => {
    let videoObject = {
      "MediaRowID": mediaId,
    }

    let url: string = '/media/deleteCampusVideoURL';
    this.whosWorking = mediaId.toString();
    this.campusService.delete(url, videoObject).subscribe(
      res => {
        if (res.message == 'Ok') {
          showNotification('top', 'right', 'success', 'Video deleted successfully');
          this.videoUrl = this.videoUrl.filter(video => res.data[0].id != video.mediaId);
          this.whosWorking = '';
        } else {
          showNotification('top', 'right', 'danger', res.message);
          this.whosWorking = '';
        }
      },
      (err) => {
        console.log(err)
        this.whosWorking = '';
      }
    );
  }

}
