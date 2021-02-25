import { Component, OnInit } from '@angular/core';
import { School } from 'src/app/models/school';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  selectedSchool: School;
  backgroundImage: string
  slideIndex: number = 1;
  slides = document.getElementsByClassName('schoolGallery');
  schools: School[];



  constructor(private schoolsService: GeneralService, private route: ActivatedRoute, private newRouter: Router) { }

  ngOnInit() {
    this.getSchoolMediaById();
  }

  /**
	* @author Deivid Mafra;
	* @date 07/26/2019;
	* @remarks This method gets a list of media from a specific school by id.
	*/
  getSchoolMediaById() {
    let url: string = '/School/getSchoolMedia/';
    this.schoolsService.getService(url + this.getSchoolId()).subscribe(
      (res) => {
        if (res.data.length < 1) {
          this.newRouter.navigate(['/search'])
        } else {
          this.schools = res.data.supporting;
          this.backgroundImage = res.data.backImage.mediaLocation;
        }
      },
      (err) => {
        console.log(err);
      });
  }

  /**
	* @author Deivid Mafra;
	* @date 10/03/2019;
	* @remarks This method gets the school id.
	*/
  getSchoolId() {
    return this.route.snapshot.paramMap.get('id');
  }

  openModal() {
    document.getElementById("galleryModal").style.display = "block";
  }

  closeModal() {
    document.getElementById("galleryModal").style.display = "none";
  }

  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n) {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n) {
    if (n > this.slides.length) {
      this.slideIndex = 1;
    }
    if (n < 0) {
      this.slideIndex = this.slides.length;
    }

    for (let i = 0; i < this.slides.length; i++) {
      this.slides[i].classList.add('schoolGalleryOff');
    }
    this.slides[this.slideIndex].classList.remove('schoolGalleryOff');
  }
}
