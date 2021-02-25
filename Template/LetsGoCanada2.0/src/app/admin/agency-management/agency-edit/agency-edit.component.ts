import { Component, OnInit, SimpleChanges } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Agency } from 'src/app/models/agency';
import { HeadQuarter } from 'src/app/models/headQuarter';
import { Agent } from 'src/app/models/agent';
import { ActivatedRoute } from '@angular/router';
import { showNotification } from 'src/app/toast-message/toast-message';

declare const $: any;

@Component({
  selector: 'app-agency-edit',
  templateUrl: './agency-edit.component.html',
  styleUrls: ['./agency-edit.component.css']
})
export class AgencyEditComponent implements OnInit {

  public profileApproved;

  constructor(private agencyService: GeneralService, private route: ActivatedRoute) { }

  //Agency form fields
  agencyForm = new FormGroup({
    agencyId: new FormControl('', Validators.required),//only for send to database
    companyName: new FormControl('', Validators.required),
    webSite: new FormControl('', Validators.required),
    profileComplete: new FormControl({ value: '', disabled: true }),
    profileApprovedShow: new FormControl({ value: '', disabled: true }),
    profileApproved: new FormControl(''),
  });

  //Headquarter form fields
  hqForm = new FormGroup({
    branchId: new FormControl('', Validators.required),//only for send to database
    agencyId: new FormControl('', Validators.required),//only for send to database
    headquarters: new FormControl(true, Validators.required),
    officeName: new FormControl('', Validators.required),
    addressLine1: new FormControl('', Validators.required),
    addressLine2: new FormControl(''),
    city: new FormControl('', Validators.required),
    province: new FormControl('', Validators.required),
    countryId: new FormControl(''),
    name: new FormControl(''),
    phoneCode: new FormControl(''),
    postalCode: new FormControl(''),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
  });

  //Ceo form fields
  ceoForm = new FormGroup({
    loginId: new FormControl('', Validators.required),//only for send to database
    email: new FormControl('', Validators.required),
    password: new FormControl(''),
    salt: new FormControl(''),
    roleId: new FormControl('', Validators.required),
    active: new FormControl(true),
    agentId: new FormControl('', Validators.required),
    branchId: new FormControl(''),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    salutation: new FormControl(''),
    citizenshipId: new FormControl(''),
    ceoPhone: new FormControl('', Validators.required),
    ceo: new FormControl(true),
    passportNumber: new FormControl('', Validators.required),
  });

  selectedAgency: Agency;
  headQuarter: HeadQuarter;
  ceoInfo: Agent;
  docs: any;
  docLocation: string;
  tab: any;
  isAllowed: boolean;
  agencyId: string;
  countries: string[];
  salutations: string[];
  fileToUpload: File = null;
  tableId: number;
  documentDescription: string;
  agencyFile: File = null;
  agID: number;

  ngOnInit() {
    this.salutations = ['Mr', 'Mrs', 'Ms'];
    this.wizard();
    this.checkRole();
    this.getAgencyToEdit();
    this.getCountryNationality();
  }

  /**
  * @author Deivid Mafra;
  * @date 11/13/2019;
  * @remarks This method returns the countries list. It's useful for the search engine dropdown list.
  */
  getCountryNationality() {
    let url = "/School/getGeoList";
    this.agencyService.getService(url).subscribe(
      (res) => {
        this.countries = res.data.country;
        // console.log("AGENCY countries>>>", this.countries)
      },
      (err) => {
        console.log(err);
      }
    )
  }

  /**
  * @author Deivid Mafra;
  * @date 11/14/2019 - 03/23/2020;
  * @remarks This method is responsible for checking the user role, aiming at showing or not the control to approve/disapprove a profile.
  */
  checkRole() {
    let session = JSON.parse(localStorage.getItem('session'));
    // console.log("Getting session info", session.role);
    if (session.role == 4 || session.role == 5) {
      this.isAllowed = true;
    }
  }

  /**
   * @author Deivid Mafra;
   * @date 11/14/2019 - 03/23/2020; 
   * @remarks This method is responsible for bringing all the agency info from the back-end and shows the wizard.
   */
  getAgencyToEdit() {

    let url: string = '/agent/searchAgency';
    let data = {
      "CountryID": [],
      "ProvinceName": [],
      "CityName": []
    }
    this.agencyService.post(url, data).subscribe(
      (res) => {
        let agencyList = res.data;
        this.selectedAgency = agencyList.find(({ agencyId }) => agencyId == this.route.snapshot.paramMap.get('id'));
        // console.log("this.selectedAgency>>>", this.selectedAgency);
        this.agencyForm.get('agencyId').setValue(this.selectedAgency.agencyId);
        this.agencyForm.get('companyName').setValue(this.selectedAgency.companyName);
        this.agencyForm.get('webSite').setValue(this.selectedAgency.webSite);
        this.agencyForm.get('profileComplete').setValue(this.selectedAgency.profileComplete);
        this.agencyForm.get('profileApprovedShow').setValue(this.selectedAgency.profileApproved);
        this.agencyForm.get('profileApproved').setValue(this.selectedAgency.profileApproved);

      },
      (err) => {
        console.log(err);
      })

    this.getHeadquarter();
    this.getCEOInfo();
    this.getListSupportDocuments();
  }

  /**
  * @author Deivid Mafra;
  * @date 11/19/2019 - 03/23/2020;
  * @remarks This method is responsible for bringing the headquarter info to the form to be edited, once that the profile is completed but not approved yet.
  */
  getHeadquarter() {
    this.agencyId = this.route.snapshot.paramMap.get('id');
    // console.log("this.agencyId***", this.agencyId)

    let url: string = '/agent/getHeadquarter';
    let data = {
      "agencyId": this.agencyId,
      "country": "",
      "province": "",
      "city": "",
      "companyName": "",
      "webSite": "",
      "profileComplete": true,
      "profileApproved": false
    }
    this.agencyService.post(url, data).subscribe(
      (res) => {
        this.headQuarter = res.data;
        // console.log("this.headQuarter>>>", this.headQuarter);
        this.hqForm.get('branchId').setValue(this.headQuarter.branchId);
        this.hqForm.get('agencyId').setValue(this.headQuarter.agencyId);
        this.hqForm.get('officeName').setValue(this.headQuarter.officeName);
        this.hqForm.get('addressLine1').setValue(this.headQuarter.addressLine1);
        this.hqForm.get('addressLine2').setValue(this.headQuarter.addressLine2);
        this.hqForm.get('city').setValue(this.headQuarter.city);
        this.hqForm.get('province').setValue(this.headQuarter.province);
        this.hqForm.get('countryId').setValue(this.headQuarter.country.countryId);
        this.hqForm.get('name').setValue(this.headQuarter.country.name);
        this.hqForm.get('phoneCode').setValue(this.headQuarter.country.phoneCode);
        this.hqForm.get('postalCode').setValue(this.headQuarter.postalCode);
        this.hqForm.get('phone').setValue(this.headQuarter.phone);
        this.hqForm.get('email').setValue(this.headQuarter.email);

      },
      (err) => {
        console.log(err);
      })
  }

  /**
  * @author Deivid Mafra;
  * @date 11/19/2019 - 03/23/2020;
  * @remarks This method is responsible for bringing the CEO info to the form to be edited.
  */
  getCEOInfo() {
    this.agencyId = this.route.snapshot.paramMap.get('id');
    let url: string = '/agent/getCEOInfo';
    let data = {
      "AgencyId": this.agencyId
    }
    this.agencyService.post(url, data).subscribe(
      (res) => {
        this.ceoInfo = res.data;

        this.ceoForm.get('loginId').setValue(this.ceoInfo.loginId);
        this.ceoForm.get('email').setValue(this.ceoInfo.email);
        this.ceoForm.get('roleId').setValue(this.ceoInfo.roleId);
        this.ceoForm.get('branchId').setValue(this.ceoInfo.agent.branchId);
        this.ceoForm.get('agentId').setValue(this.ceoInfo.agent.agentId);
        // from form
        this.ceoForm.get('salutation').setValue(this.ceoInfo.agent.salutation);
        this.ceoForm.get('firstName').setValue(this.ceoInfo.agent.firstName);
        this.ceoForm.get('lastName').setValue(this.ceoInfo.agent.lastName);
        this.ceoForm.get('citizenshipId').setValue(this.ceoInfo.agent.citizenshipId);
        this.ceoForm.get('ceoPhone').setValue(this.ceoInfo.agent.phone);
        this.ceoForm.get('passportNumber').setValue(this.ceoInfo.agent.passportNumber);

      },
      (err) => {
        console.log(err);
      })
  }

  /**
  * @author Deivid Mafra;
  * @date 11/14/2019 - 03/23/2020;
  * @remarks This method is responsible for allowing the end-user to approve or disapprove a profile
  * @param isApproved represents the current profile status and receives the new one if necessary.
  */
  checkValue(isApproved: boolean) {
    if (!this.agencyForm.valid) {
      showNotification('top', 'right', 'warning', 'You cannot approve agency until all fields completed.')
    } else {

      let url: string = '/agent/approveAgency';
      let data = {
        "agencyId": this.selectedAgency.agencyId,
        "country": "",
        "province": "",
        "city": "",
        "companyName": "",
        "webSite": "",
        "profileComplete": false,
        "profileApproved": isApproved,
      }
      this.agencyService.post(url, data).subscribe(
        (res) => {
          if (res.message == 'Ok')
            if (isApproved) {
              showNotification('top', 'right', 'success', 'Agency approved successfully!');
            } else
              showNotification('top', 'right', 'warning', 'Agency is not approved yet!');
        },
        (err) => {
          console.log(err)
          showNotification('top', 'right', 'danger', 'Error trying to approve the agency!')
        })
    }

  }

  /**
   * @author Deivid Mafra;
   * @date 11/15/2019 - 03/23/2020;
   * @remarks This method is responsible for validate and send the info from the agency form to the back-end.
   */
  onSubmitAgency() {

    let url: string = '/agent/setAgency';
    let data = this.agencyForm.value;

    if (this.agencyForm && this.agencyForm.get('profileApproved').value == false) {
      console.log('notify lets go canada team they have submitted registration and waiting for approval')
      showNotification('top', 'center', 'info', 'Please notify Lets Go Canada you have submitted a new agency registration. Please wait for the approval.', 0);
    }
    console.log(this.agencyForm.get('profileApproved').value)

    this.agencyService.post(url, data).subscribe(
      (res) => {
        if (res.message == 'Ok')
          showNotification('top', 'right', 'success', 'Agency updated successfully!');
      },
      (err) => {
        console.log(err)
        showNotification('top', 'right', 'danger', 'Error trying to update the agency info!')
      })
  }

  /**
  * @author Deivid Mafra;
  * @date 11/15/2019 - 03/23/2020;
  * @remarks This method is responsible for validate and send the info from the headquarter form to the back-end.
  */
  onSubmitHq() {

    let url: string = '/agent/setBranch';
    let data = this.hqForm.value;

    this.agencyService.post(url, data).subscribe(
      (res) => {
        if (res.message == 'Ok')
          showNotification('top', 'right', 'success', 'Headquarter updated successfully!');
      },
      (err) => {
        console.log(err)
        showNotification('top', 'right', 'danger', 'Error trying to update the headquarter info!')
      })
  }

  /**
  * @author Deivid Mafra;
  * @date 11/19/2019 - 03/23/2020;
  * @remarks This method is responsible for validate and send the info from the Ceo form to the back-end.
  */
  onSubmitCeo() {
    let url: string = '/agent/setAgent';
    this.ceoForm.get('agentId').setValue(this.ceoInfo.agent.agentId);

    let data = {
      "loginId": this.ceoForm.get('loginId').value,
      "email": this.ceoForm.get('email').value,
      "password": null,
      "roleId": this.ceoForm.get('roleId').value,
      "active": true,
      "role": null,
      "agent": {
        "agentId": this.ceoForm.get('loginId').value,
        "branchId": this.ceoForm.get('branchId').value,
        "firstName": this.ceoForm.get('firstName').value,
        "lastName": this.ceoForm.get('lastName').value,
        "salutation": this.ceoForm.get('salutation').value,
        "citizenshipId": this.ceoForm.get('citizenshipId').value,
        "phone": this.ceoForm.get('ceoPhone').value,
        "ceo": true,
        "passportNumber": this.ceoForm.get('passportNumber').value,
        "keyword": "",
        "agentNavigation": null,
        "branch": null,
        "citizenship": null,
        "applicant": null
      },
      "applicant": null,
      "lgcpersonal": null,
      "loginStatus": null,
      "notes": [],
      "securityQuestions": []
    }

    this.agencyService.post(url, data).subscribe(
      (res) => {
        if (res.message == 'Ok')
          showNotification('top', 'right', 'success', 'CEO information updated successfully!');
      },
      (err) => {
        console.log(err)
        showNotification('top', 'right', 'danger', 'Error trying to update the CEO info!')

      })
  }

  save() {
    this.tab = $('.card-wizard .wizard-navigation li a.nav-link.active').html();
    console.log("tab", this.tab.trim());
    switch (this.tab.trim()) {
      case 'Agency':
        if (!this.agencyForm.valid) {
        } else
          this.onSubmitAgency();
        break;

      case 'Headquarter':
        if (!this.hqForm.valid) {
        } else
          this.onSubmitHq();
        break;

      case 'CEO':
        if (!this.ceoForm.valid) {
        } else
          this.onSubmitCeo();
        break;

      default:
        break;
    }
  }


  wizard() {

    // Wizard Initialization
    $('.card-wizard').bootstrapWizard({
      'tabClass': 'nav nav-pills',
      'nextSelector': '.btn-next',
      'previousSelector': '.btn-previous',

      onInit: function (tab: any, navigation: any, index: any) {

        // check number of tabs and fill the entire row
        let $total = navigation.find('li').length;
        let $wizard = navigation.closest('.card-wizard');

        let $first_li = navigation.find('li:first-child a').html();
        let $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
        $('.card-wizard .wizard-navigation').append($moving_div);

        $total = $wizard.find('.nav li').length;
        let $li_width = 100 / $total;

        let total_steps = $wizard.find('.nav li').length;
        let move_distance = $wizard.width() / total_steps;
        let index_temp = index;
        let vertical_level = 0;

        let mobile_device = $(document).width() < 600 && $total > 3;

        if (mobile_device) {
          move_distance = $wizard.width() / 2;
          index_temp = index % 2;
          $li_width = 50;
        }

        $wizard.find('.nav li').css('width', $li_width + '%');

        let step_width = move_distance;
        move_distance = move_distance * index_temp;

        let $current = index + 1;

        if ($current == 1 || (mobile_device == true && (index % 2 == 0))) {
          move_distance -= 8;

        } else if ($current == total_steps || (mobile_device == true && (index % 2 == 1))) {
          move_distance += 8;
        }

        if (mobile_device) {
          let x: any = index / 2;
          vertical_level = parseInt(x);
          vertical_level = vertical_level * 38;
        }

        $wizard.find('.moving-tab').css('width', step_width);
        $('.moving-tab').css({
          'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
          'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

        });
        $('.moving-tab').css('transition', 'transform 0s');
      },


      onNext: function (tab, navigation, index) {
        if (index == 1) {
          if (!$('#agencyName').val()) {
            showNotification('top', 'right', 'warning', 'You should fill the Agency Name field!');
            $('#agencyName').focus();
            return false;
          }

          if (!$('#webSite').val()) {
            showNotification('top', 'right', 'warning', 'You should fill the Web Site field!');
            $('#webSite').focus();
            return false;
          }

        } else if (index == 2) {
          if (!$('#officeName').val()) {
            showNotification('top', 'right', 'warning', 'You should fill the Office Name field!');
            $('#officeName').focus();
            return false;
          }

          if (!$('#addressLine1').val()) {
            showNotification('top', 'right', 'warning', 'You should fill the Address Line 1 field!');
            $('#addressLine1').focus();
            return false;
          }

          if (!$('#province').val()) {
            showNotification('top', 'right', 'warning', 'You should fill the Province field!');
            $('#province').focus();
            return false;
          }

          if (!$('#city').val()) {
            showNotification('top', 'right', 'warning', 'You should fill the City field!');
            $('#city').focus();
            return false;
          }

          if (!$('#phone').val()) {
            showNotification('top', 'right', 'warning', 'You should fill the Phone field!');
            $('#phone').focus();
            return false;
          }

          if (!$('#email').val()) {
            showNotification('top', 'right', 'warning', 'You should fill the email field!');
            $('#email').focus();
            return false;
          }
        } else if (index == 3) {
          if (!$('#firstName').val()) {
            showNotification('top', 'right', 'warning', 'You should fill the First Name field!');
            $('#firstName').focus();
            return false;
          }
          if (!$('#lastName').val()) {
            showNotification('top', 'right', 'warning', 'You should fill the Last Name field!');
            $('#lastName').focus();
            return false;
          }
          if (!$('#ceoPhone').val()) {
            showNotification('top', 'right', 'warning', 'You should fill the Phone field!');
            $('#ceoPhone').focus();
            return false;
          }
          if (!$('#passportNumber').val()) {
            showNotification('top', 'right', 'warning', 'You should fill the Passport Number field!');
            $('#passportNumber').focus();
            return false;
          }
        }

      },

      onTabShow: function (tab: any, navigation: any, index: any) {
        let $total = navigation.find('li').length;
        let $current = index + 1;

        const $wizard = navigation.closest('.card-wizard');

        // If it's the last tab then hide the last button and show the finish instead

        if ($current >= 1) {
          $($wizard).find('.btn-next').hide();
          $($wizard).find('.btn-back0').show();
        }

        if ($current >= $total) {
          $($wizard).find('.btn-next').hide();
          $($wizard).find('.btn-back1').show();
          $($wizard).find('.btn-back0').hide();
          // $($wizard).find('.btn-finish').show();
        } else {
          $($wizard).find('.btn-next').show();
          $($wizard).find('.btn-finish').hide();
          $($wizard).find('.btn-back1').hide();
        }

        const button_text = navigation.find('li:nth-child(' + $current + ') a').html();

        setTimeout(function () {
          $('.moving-tab').text(button_text);
        }, 150);

        const checkbox = $('.footer-checkbox');

        if (index !== 0) {
          $(checkbox).css({
            'opacity': '0',
            'visibility': 'hidden',
            'position': 'absolute'
          });
        } else {
          $(checkbox).css({
            'opacity': '1',
            'visibility': 'visible'
          });
        }
        $total = $wizard.find('.nav li').length;
        let $li_width = 100 / $total;

        let total_steps = $wizard.find('.nav li').length;
        let move_distance = $wizard.width() / total_steps;
        let index_temp = index;
        let vertical_level = 0;

        let mobile_device = $(document).width() < 600 && $total > 3;

        if (mobile_device) {
          move_distance = $wizard.width() / 2;
          index_temp = index % 2;
          $li_width = 50;
        }

        $wizard.find('.nav li').css('width', $li_width + '%');

        let step_width = move_distance;
        move_distance = move_distance * index_temp;

        $current = index + 1;

        if ($current == 1 || (mobile_device == true && (index % 2 == 0))) {
          move_distance -= 8;
        } else if ($current == total_steps || (mobile_device == true && (index % 2 == 1))) {
          move_distance += 8;
        }

        if (mobile_device) {
          let x: any = index / 2;
          vertical_level = parseInt(x);
          vertical_level = vertical_level * 38;
        }

        $wizard.find('.moving-tab').css('width', step_width);
        $('.moving-tab').css({
          'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
          'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
        });
      }

    });

    // Prepare the preview for profile picture
    $('#wizard-picture').change(function () {
      const input = $(this);

      if (input[0].files && input[0].files[0]) {
        const reader = new FileReader();

        reader.onload = function (e: any) {
          $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
        };
        reader.readAsDataURL(input[0].files[0]);
      }
    });

    $('[data-toggle="wizard-radio"]').click(function () {
      const wizard = $(this).closest('.card-wizard');
      wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
      $(this).addClass('active');
      $(wizard).find('[type="radio"]').removeAttr('checked');
      $(this).find('[type="radio"]').attr('checked', 'true');
    });

    $('[data-toggle="wizard-checkbox"]').click(function () {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).find('[type="checkbox"]').removeAttr('checked');
      } else {
        $(this).addClass('active');
        $(this).find('[type="checkbox"]').attr('checked', 'true');
      }
    });

    $('.set-full-height').css('height', 'auto');
  }

  getListSupportDocuments() {
    this.agencyId = this.route.snapshot.paramMap.get('id');
    let url: string = '/agent/ListSupportDocuments';
    let data = {
      "agencyId": this.agencyId,
      "country": "",
      "province": "",
      "city": "",
      "companyName": "",
      "webSite": "",
      "profileComplete": false,
      "profileApproved": false
    }
    this.agencyService.post(url, data).subscribe(
      (res) => {
        this.docs = res.data;
        this.docLocation = res.data.documentLocation;
      },
      (err) => {
      })
  }

  deleteDocument(event, id: number, docLoc: string, docName: string, docDesc: string, index: number) {
    event.preventDefault();

    let url: string = '/agent/fileDelete';
    let data = {
      "TableId": id,
      "documentLocation": docLoc,
      "documentName": docName,
      "documentDescription": docDesc,
      "TypeDoc": "AgentDocs"
    };

    this.agencyService.deleteFile(url, data).subscribe(
      (res) => {
        if (res.message == 'Ok') {
          this.docs[index].documentLocation = res.data[0].documentLocation
          this.docs[index].documentName = "";
          showNotification('top', 'right', 'success', 'The document was deleted successfully.');
        }
      },
      (err) => {
        console.log(err)
        showNotification('top', 'right', 'danger', 'An error ocurred trying to delete the document.');
      }
    )
  }

  download(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);

    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      // console.log('Please disable your Pop-up blocker and try again.');
    }
  }

  getFileDownload(event, id: number, docLoc: string, docName: string, docDesc: string) {
    event.preventDefault();

    this.tableId = id;
    let url: string = '/agent/fileDownload';
    let data = {
      "TableId": id,
      "documentLocation": docLoc,
      "documentName": docName,
      "documentDescription": docDesc
    };

    // console.log("download data>>>", data);

    this.agencyService.downloadFile(url, data).subscribe(
      (res) => {
        // console.log("this.tableId", this.tableId)
        this.download(res.body, res.body.type);
      },
      (err) => {
        console.log(err)
        showNotification('top', 'right', 'danger', 'An error ocurred trying to download the document.');
      }
    )
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

  }

  getFileInfo(id: number, agId: number, desc: string, index: number) {
    this.tableId = id;
    this.agID = agId;
    this.documentDescription = desc;
    this.fileUpload(index);
  }

  /**
   * @author Deivid.Mafra
   * @date 11/18/2019
   * @param index it keeps the track of the file to be uploaded.
   * @remarks This method is responsible to send the file to the back-end.
   */
  fileUpload(index) {

    let url: string = '/agent/fileUpload?AgencyID=' + this.docs[index].agencyId + '&TableID=' + this.docs[index].id + '&TypeDoc=AgentDocs';

    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    this.agencyService.postFile(url, formData).subscribe(
      (res) => {

        if (res.message == 'Ok') {
          showNotification('top', 'right', 'success', 'The document was saved successfully.');

          this.docs[index].documentLocation = res.data[0].documentLocation
          this.docs[index].documentName = res.data[0].documentName;

        }
      },
      (err) => {
        //showNotification('top', 'right', 'danger', 'An error ocurred trying to save the document.');
        showNotification('top', 'right', 'danger', err.error.message);
      }
    )

  }

  ngOnChanges(changes: SimpleChanges) {
    const input = $(this);

    if (input[0].files && input[0].files[0]) {
      const reader: any = new FileReader();

      reader.onload = function (e: any) {
        $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
      };
      reader.readAsDataURL(input[0].files[0]);
    }
  }
}