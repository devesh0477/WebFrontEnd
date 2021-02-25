import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { School } from 'src/app/models/school';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { VideoObj } from 'src/app/models/videoObj';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  selectedSchool: School;
  schools: School[];
  id: string;
  about: string
  hasCoop: boolean;
  hasWork: boolean;
  hasCondLetter: boolean;
  hasPgwp: boolean;
  hasAccomodation: boolean;
  public videoObj: VideoObj = new VideoObj();

  constructor(private schoolsService: GeneralService, private route: ActivatedRoute, private newRouter: Router) { }

  ngOnInit() {

    this.getSchoolInfoById();
  }

  /**
  * @author Deivid Mafra;
  * @date 09/19/2019;
  * @remarks This method simulates resizing screen in order to show the chart correctly.
  */
  simulateSizeScreen() {

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event('resize'));
    }, 1);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1);
  }

  /**
   * @author Deivid Mafra;
   * @date 08/07/2019;
   * @remarks This method gets school info by id.
   */
  getSchoolInfoById() {
    let url: string = '/School/getSchool/';
    this.schoolsService.getService(url + this.getSchoolId()).subscribe(
      (res) => {

        if (res.data.length < 1) {
          this.newRouter.navigate(['/search'])
        } else {
          this.schools = res.data,
            this.about = res.data[0].about,
            this.hasCoop = res.data[0].feature.hasCoop,
            this.hasWork = res.data[0].feature.hasWorkWhileStudy,
            this.hasCondLetter = res.data[0].feature.hasConditionalLoa,
            this.hasAccomodation = res.data[0].feature.hasAccomodation,
            this.hasPgwp = res.data[0].feature.hasPgwp;
        }
      },
      (err) => {
        console.log(err);
      })
  }


  getSchoolId() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.videoObj.mediaId = +this.id;
    this.videoObj.url = '/media/getSchoolVideoURL/';
    this.videoObj.width = 920;
    this.videoObj.height = 670;
    return this.id;
  }

  /**
   * @author Deivid Mafra;
   * @date 08/07/2019;
   * @remarks This method shows modal up with school features info;
   * @param type It's the type of school feature.
   */
  showSwal(type) {
    if (type == 'coop') {
      if (this.hasCoop) {
        swal({
          title: "Programs with co - op option",
          text: "Cooperative education(or co - operative education) is a method of combining classroom - based education with practical work experience.A cooperative education experience(co - op), provides academic credit for structured job experience.Co - ops are full - time, paid or unpaid positions.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn"
        }).catch(swal.noop)
      } else {
        swal({
          title: "No Programs with co - op option",
          text: "Cooperative education(or co- operative education) is a method of combining classroom - based education with practical work experience.A cooperative education experience(co - op), provides academic credit for structured job experience.Co - ops are full - time, paid or unpaid positions.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn"
        }).catch(swal.noop)
      }
    } else if (type == 'work') {
      if (this.hasWork) {
        swal({
          title: "Work while studying",
          text: "Cooperative education(or co- operative education) is a method of combining classroom - based education with practical work experience.A cooperative education experience(co - op), provides academic credit for structured job experience.Co - ops are full - time, paid or unpaid positions.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn"
        }).catch(swal.noop)
      } else {
        swal({
          title: "No Work while studying",
          text: "Cooperative education(or co- operative education) is a method of combining classroom - based education with practical work experience.A cooperative education experience(co - op), provides academic credit for structured job experience.Co - ops are full - time, paid or unpaid positions.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn"
        }).catch(swal.noop)
      }
    } else if (type == 'letter') {
      if (this.hasCondLetter) {
        swal({
          title: "Conditional offer letter",
          text: "Even if you do NOT meet our minimum English requirement(IELTS or TOEFL) , you still can get conditionally accepted in the program of your choice with the condition of completing our English program prior to starting your chosen program.",
          buttonsStyling: false,
          confirmButtonClass: "btn bt"
        }).catch(swal.noop)
      } else {
        swal({
          title: "No Conditional offer letter",
          text: "Cooperative education(or co- operative education) is a method of combining classroom - based education with practical work experience.A cooperative education experience(co - op), provides academic credit for structured job experience.Co - ops are full - time, paid or unpaid positions.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn"
        }).catch(swal.noop)
      }
    } else if (type == 'accomodation') {
      if (this.hasAccomodation) {
        swal({
          title: "Accomodation",
          text: "Cooperative education(or co- operative education) is a method of combining classroom - based education with practical work experience.A cooperative education experience(co - op), provides academic credit for structured job experience.Co - ops are full - time, paid or unpaid positions.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn"
        }).catch(swal.noop)
      } else {
        swal({
          title: "No Accomodation",
          text: "Cooperative education(or co- operative education) is a method of combining classroom - based education with practical work experience.A cooperative education experience(co - op), provides academic credit for structured job experience.Co - ops are full - time, paid or unpaid positions.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn"
        }).catch(swal.noop)
      }
    } else if (type == 'pgwp') {
      if (this.hasAccomodation) {
        swal({
          title: "Pgwp",
          text: "Cooperative education(or co- operative education) is a method of combining classroom - based education with practical work experience.A cooperative education experience(co - op), provides academic credit for structured job experience.Co - ops are full - time, paid or unpaid positions.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn"
        }).catch(swal.noop)
      } else {
        swal({
          title: "No Pgwp",
          text: "Cooperative education(or co- operative education) is a method of combining classroom - based education with practical work experience.A cooperative education experience(co - op), provides academic credit for structured job experience.Co - ops are full - time, paid or unpaid positions.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn"
        }).catch(swal.noop)
      }
    }


  }
}