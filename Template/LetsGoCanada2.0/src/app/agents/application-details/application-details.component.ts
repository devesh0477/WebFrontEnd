import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { Applicant } from 'src/app/models/applicant';
import { Documento } from 'src/app/models/documento';
import { ApplicationDoc } from 'src/app/models/applicationDoc';
import { ApplicationNote } from 'src/app/models/applicationNote';
import { parseDate } from 'ngx-bootstrap';
import { GLOBAL } from 'src/app/services/global';
import { formatNumber } from '@angular/common';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare const $: any;

@Component({
	selector: 'app-application-details',
	templateUrl: './application-details.component.html',
	styleUrls: ['./application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit, NotificationsComponent {

	@ViewChild('myInput') myInputVariable: ElementRef;

	public application;
	public applicant: Applicant;
	public details;
	public documents: Array<Documento>;
	public documentsApplication: Array<ApplicationDoc>;
	public applicationNotes;
	public appliNote = '';
	public file;
	public DocumentDesc: string;
	public statusList;
	public session;
	public isAdmin: boolean = false;
	public statusSelected;
	public paymentInfo;
	public showPayment: boolean = false;
	public paymentURL:SafeResourceUrl = '';
	public uri:string;


	constructor(private route: ActivatedRoute, private service: GeneralService, private router: Router, private sanitizer: DomSanitizer) {

		this.session = JSON.parse(localStorage.getItem('session'));
		// console.log(this.session.role)
		if (GLOBAL.admin.includes(parseInt(this.session.role))) {
			this.isAdmin = true;
		} else {
			this.isAdmin = false;
		}

		if (localStorage.getItem('session') === null || this.session.id == 0) {
			this.router.navigate(['/login']);
		} else {
			this.loadApplicationInfo();
			this.loadApplicationNotes();
			this.getApplicationPayment();
			this.showPayment = false;

		}

	}

	/**
	 * 
	 * @param from 
	 * @param align 
	 * @param type 
	 * @param messages
	 * @author Diego.Perez
	 * @date 09/02/2019 
	 */
	showNotification(from: any, align: any, type: any, messages: any): void {
		$.notify({
			icon: 'notifications',
			message: messages //'Welcome to <b>Material Dashboard</b> - a beautiful dashboard for every web developer.'
		}, {
			type: type,//[color],
			timer: 3000,
			placement: {
				from: from,
				align: align
			},
			template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
				'<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
				'<i class="material-icons" data-notify="icon">notifications</i> ' +
				'<span data-notify="title">{1}</span> ' +
				'<span data-notify="message">{2}</span>' +
				'<div class="progress" data-notify="progressbar">' +
				'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
				'</div>' +
				'<a href="{3}" target="{4}" data-notify="url"></a>' +
				'</div>'
		});
	}

	/**
	 * @author Diego.Perez
	 * @date 10/19/2019
	 */
	loadStatusList() {
		// let url: string = '/Application/getStatusList';
		// let url: string = '/Application/getNextInternalStatusList/' + this.application.internalStatus.id;
		let url: string = '/Application/getDDLNextInternalStatusList/' + this.application.internalStatus.id;

		//console.log('THE INTERNAL STATUS AS WELL: ' + this.application.internalStatus.id)

		this.statusSelected = this.application.internalStatus.id;
		//console.log('THIS IS THE SELECTED STATUS: ' + this.statusSelected)
		this.service.post(url, null).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					//console.log('Vamos a por esas listas')
					this.statusList = res.data;
					//console.log('the new status list')
					// console.log(this.statusList)
				}

			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 10/08/2019
	 */
	reset() {
		// console.log(this.myInputVariable.nativeElement.files[0]);
		this.myInputVariable.nativeElement.value = "";
		//$('#docum').val(null);
		this.DocumentDesc = '';
		// console.log(this.myInputVariable.nativeElement.files);
	}

	ngOnInit() {
		var mainPanel = document.getElementsByClassName('main-panel')[0];
		$('.modal').on('shown.bs.modal', function () {
			mainPanel.classList.add('no-scroll');
		})
		$('.modal').on('hidden.bs.modal', function () {
			mainPanel.classList.remove('no-scroll');
		})
	}

	/**
	 * @author Diego.Perez
	 * @date 10/03/2019
	 */
	loadApplicationNotes() {

		let url: string = '/Application/getApplicationNotes/' + this.route.snapshot.paramMap.get('id');

		// this.service.getService(url).subscribe(
		this.service.post(url, null).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					this.applicationNotes = res.data;
				}
			},
			(err) => {
				console.log(err)
			}
		)
	}


	/**
	 * Method to call all the documents relate it.
	 */
	loadDocuments() {
		// console.log(this.applicant.applicantId);
		let url: string = '/Applicant/ListSupportDocuments/' + this.applicant.applicantId;
		//let url: string = '/Application/getApplicationDocumentList/' + this.applicant.applicantId;

		this.service.getService(url).subscribe(
			(res) => {
				this.documents = new Array<Documento>();
				this.documents = res.data;
				this.loadDocumentsApplications();
			},
			(err) => {
				console.log(err);
			}
		)
	}

	/**
	 * @author Diego.Perez.
	 * @date 08/13/2019.
	 */
	loadDocumentsApplications() {
		let id = this.route.snapshot.paramMap.get('id');
		let url: string = '/Application/getApplicationDocumentList/' + id;

		// this.service.getService(url).subscribe(
		this.service.post(url, null).subscribe(
			(res) => {
				this.documentsApplication = res.data[0];
			},
			(err) => {
				console.log(err);
			}
		)
	}

	/**
	 * 
	 * @author Diego.Perez.
	 * @date 08/07/2019.
	 */
	loadApplicationInfo() {
		let id = this.route.snapshot.paramMap.get('id');

		let url: string = '/Application/getApplicationById/' + id;
		// this.service.getService(url).subscribe(
		this.service.post(url, null).subscribe(
			(res) => {

				if (res.message == 'Ok') {
					//console.log(res.data[0])
					this.application = res.data[0];
					this.details = res.data[0].programsPerTerm;
					// console.clear()
					this.loadStatusList();
					this.statusSelected = this.application.internalStatus.id;

					url = '/Applicant/getApplicant/' + res.data[0].applicantId;
					this.service.getService(url).subscribe(
						(res) => {
							if (res.message == 'Ok') {

								this.applicant = new Applicant();
								this.applicant = res.data[0];
								this.loadDocuments();
							}
						},
						(err) => {
							console.log(err);
						}
					);
				}

			},
			(err) => {
				console.log(err);
				this.router.navigate(['/applications'])
			}
		)
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez
	 * @date 08/08/2019
	 */
	editApplicantInfo(event, id) {
		event.preventDefault();
		//console.log(event.target);
		//console.log(id);
		this.router.navigate(['profile/' + id]);
	}

	/**
	 * @author Diego.Perez
	 * @date 10/02/2019
	 */
	downloadDocument(event, i) {

		event.preventDefault();
		// console.log(i);

		let data = {
			'DocumentName': this.documents[i].documentName,
			'TypeDoc': this.documents[i].typeDoc,
			'ApplicantId': this.documents[i].applicantId
		};


		let url: string = '/Applicant/fileDownload';

		this.service.downloadFile(url, data).subscribe(
			(response) => {
				// console.log('respuesta')
				// console.log(response.body);
				this.downLoadFile(response.body, response.body.type);


			},
			(err) => {
				//console.log('erorrrororrrr')
				console.log(err)
				this.showNotification('top', 'right', 'danger', 'An error ocurred trying to download the document.');
			}
		)
	}

	/**
	 * 
	 * @param $event 
	 * @param index
	 * @author Diego.Perez
	 * @date 10/02/2019
	 */
	downloadDocuApplica(event, index) {

		event.preventDefault();

		let data = {
			'DocumentName': this.documentsApplication[index].name,
			'ObjectID': this.documentsApplication[index].applicationDocumentsId,
			'TypeDoc': 'Application'
		};

		let url: string = '/Application/fileDownload';

		this.service.downloadFile(url, data).subscribe(
			(response) => {
				this.downLoadFile(response.body, response.body.type);
			},
			(err) => {
				console.log(err)
				this.showNotification('top', 'right', 'danger', 'An error ocurred trying to download the document.');
			}
		)

	}

	/**
	 * Method to download a file.
	 * 
	 * @param data 
	 * @param type 
	 * @author Diego.Perez.
	 * @date 07/31/2019
	 */
	downLoadFile(data: any, type: string) {
		let blob = new Blob([data], { type: type });
		let url = window.URL.createObjectURL(blob);
		let pwa = window.open(url);

		if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
			this.showNotification('top', 'right', 'warning', 'Please disable your Pop-up blocker and try again.');
		}
	}

	/**
	 * 
	 * @param index 
	 * @author Diego.Perez
	 * @date 10/02/2019
	 */
	deleteDocument(index) {
		//console.log(this.documentsApplication[index].name)

		let data = {
			'DocumentName': this.documentsApplication[index].name,
			'ObjectID': this.documentsApplication[index].applicationDocumentsId,
			'TypeDoc': 'Application'
		};

		let url: string = '/Application/fileDelete';

		this.service.deleteFile(url, data).subscribe(
			(res) => {

				if (res.message == 'Ok') {
					this.documentsApplication.splice(index, 1);
					this.showNotification('top', 'right', 'success', 'The document was deleted.');
				}
			},
			(err) => {
				console.log(err)
				this.showNotification('top', 'right', 'danger', 'A problem occurred trying to delete the document.');
			}
		)
	}

	/**
	 * 
	 * @param $event 
	 * @author Diego.Perez
	 * @date 10/02/2019
	 */
	onDocumentChange(event) {
		if (event.target.files.length > 0) {
			this.file = event.target.files[0];
		}
	}

	/**
	 * 
	 * @param file 
	 * @author Diego.Perez
	 * @date 10/03/2019
	 */
	saveApplicationDocument() {

		if (this.file.type == 'application/pdf') {

			let url: string = '/Application/fileUpload?ApplicationID=' + this.route.snapshot.paramMap.get('id') + '&TypeDoc=Application&Name=' + this.file.name + '&Description=' + this.DocumentDesc;

			const formData = new FormData();
			formData.append('file', this.file);
			formData.append('ApplicationID', this.route.snapshot.paramMap.get('id'));
			formData.append('TypeDoc', 'Application');
			formData.append('TypeDoc', 'Application');
			formData.append('Description', this.DocumentDesc);


			this.service.postFile(url, formData).subscribe(
				(res) => {
					if (res.message == 'Ok') {

						let appliDoc = new ApplicationDoc();
						appliDoc.applicationDocumentsId = res.data[0].applicationDocumentsId;
						appliDoc.name = res.data[0].name;
						appliDoc.description = res.data[0].description;
						appliDoc.location = res.data[0].location;

						this.documentsApplication.push(appliDoc);

						this.reset();
						this.showNotification('top', 'right', 'success', 'The document was saved successfully.');
					}
				},
				(err) => {
					this.showNotification('top', 'right', 'danger', err.error.message);
				}
			)
		} else {
			console.log('put the message for invalid type of document')
		}
	}

	/**
	 * @author Diego.Perez
	 * @date 10/05/2019
	 */
	saveNote() {

		if (this.appliNote != null && this.appliNote != '') {

			let url: string = '/Application/addApplicationNote';

			let data = {
				ApplicationId: this.route.snapshot.paramMap.get('id'),
				LoginId: JSON.parse(localStorage.getItem('session')).id,
				Message: this.appliNote,
				CreatedDate: new Date()
			};

			this.service.post(url, data).subscribe(
				(res) => {
					//console.log(res)
					if (res.message == 'Ok') {

						this.applicationNotes.push(res.data);
						this.appliNote = '';
						this.showNotification('top', 'right', 'success', 'The note was saved successfully.');
					}
				},
				(err) => {
					console.log(err)
					this.showNotification('top', 'right', 'danger', 'A problem occurred trying to save the note.');
				}
			)
		} else {
			this.showNotification('top', 'right', 'warning', 'The note can not be empty.');
		}

	}

	/**
	 * @author Diego.Perez
	 * @date 10/21/2019
	 */
	saveInternalStatus() {
		let url: string = '/Application/updateInternalStatusHistory';

		let data = {
			"applicationID": parseInt(this.route.snapshot.paramMap.get('id')),
			"newInternalStatusID": this.statusSelected,
			"loginID": this.session.id
		}

		this.service.post(url, data).subscribe(
			(res) => {

				if (res.message == 'Ok') {
					this.application.statusDate = new Date();
					this.application.internalStatus.id = this.statusSelected;
					this.loadStatusList();
					this.showNotification('top', 'right', 'success', 'The application status was updated successfully.');
				}
			},
			(err) => {
				console.log(err)
				this.showNotification('top', 'right', 'danger', 'A problem occurred trying to update the application status.');
			}
		)
	}

	/**
	 * @param applicant Object that containts the applicant selected.
	 * @author Diego.Perez.
	 * @date 02/09/2020
	 */
	downloadSumaryDocument() {

		let url: string = '/Applicant/getApplication_Full/' + parseInt(this.route.snapshot.paramMap.get('id'));
		//console.log(parseInt(this.route.snapshot.paramMap.get('id')));
		this.service.downloadFile(url, this.applicant.applicantId).subscribe(
			(res) => {
				this.downLoadFile(res.body, res.body.type);
			},
			(err) => {
				this.showNotification('top', 'right', 'danger', 'An error occurred trying to download the document.');
				console.log(err)
			}
		);
	}

	/**
	 * @author Diego.Perez.
	 * @date 03/19/2020
	 */
	downloadMainInformationDocument() {
		let url: string = '/Applicant/getApplicantDocuments/' + this.applicant.applicantId;
		//console.log(this.applicant.applicantId);
		this.service.downloadFile(url, this.applicant.applicantId).subscribe(
			(res) => {
				this.downLoadFile(res.body, res.body.type);
			},
			(err) => {
				this.showNotification('top', 'right', 'danger', 'An error occurred trying to download the document.');
				console.log(err)
			}
		);
	}

	/**
	 * @author Diego.Perez.
	 * @date 03/20/2020
	 */
	downloadApplicationDocument() {
		let url: string = '/Applicant/getApplication/' + parseInt(this.route.snapshot.paramMap.get('id'));
		//console.log(parseInt(this.route.snapshot.paramMap.get('id')));
		this.service.downloadFile(url, this.applicant.applicantId).subscribe(
			(res) => {
				this.downLoadFile(res.body, res.body.type);
			},
			(err) => {
				this.showNotification('top', 'right', 'danger', 'An error occurred trying to download the document.');
				console.log(err)
			}
		);
	}

	/**
	 * @author Andres.Cordoba.
	 * @date 3/23/2020
	 */
	downloadApplicantDocument_Full() {
		let url: string = '/Applicant/getApplicantDocuments_Full/' + this.applicant.applicantId;
		this.service.downloadFile(url, this.applicant.applicantId).subscribe(
			(res) => {
				this.downLoadFile(res.body, res.body.type);
			},
			(err) => {
				this.showNotification('top', 'right', 'danger', 'An error occurred trying to download the document.');
				console.log(err);
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 04/28/2020
	 */
	getApplicationPayment() {
		let url: string = '/Payment/getApplicationPayments/' + this.route.snapshot.paramMap.get('id');
		// console.log('This is the param ', this.route.snapshot.paramMap.get('id'))
		this.service.getService(url).subscribe(
			(res) => {
				this.paymentInfo = res.data;
				// console.log('Payment Info ', this.paymentInfo);
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * @author Diego.Perez.
	 * @date 04/28/2020
	 */
	getPaymentLink() {
		let url: string = '/Payment/getPaymentLink/' + this.route.snapshot.paramMap.get('id');

		this.service.getService(url).subscribe(

			(res) => {				
				this.uri = res.data;
				this.paymentURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.uri);
				this.showPayment = true;
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * @author Diego.Perez.
	 * @date 04/30/2020
	 */
	openForBusiness() {		
		this.getPaymentLink();
	}

}