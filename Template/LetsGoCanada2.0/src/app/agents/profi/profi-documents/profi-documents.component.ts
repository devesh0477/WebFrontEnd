import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Profile } from 'src/app/models/profile';
import { GeneralService } from 'src/app/services/general.service';
import { Documento } from 'src/app/models/documento';
import { ToastmsgService } from 'src/app/services/toastmsg.service';
import { ActivatedRoute } from '@angular/router';
import { ComunicationService } from 'src/app/services/comunication.service';

@Component({
	selector: 'app-profi-documents',
	templateUrl: './profi-documents.component.html',
	styleUrls: ['./profi-documents.component.css']
})
export class ProfiDocumentsComponent implements OnInit {

	@Input() profile: Profile;

	//public isSavingDocument:boolean = false;
	public buttonActioning: number = -1;

	constructor(private service: GeneralService, private toast: ToastmsgService, private route: ActivatedRoute, private communication: ComunicationService) {
		let id: number = parseInt(this.route.snapshot.paramMap.get('id'));
		if (id != null) {
			this.loadDocuments(id)
		}

		this.communication.listenerProcess().subscribe(
			(res) => {
				if (res.applicantId != null && res.applicantId > 0) {
					this.loadDocuments(res.applicantId);
				}
			}
		);

	}

	/**
	 * @param index 
	 * @author Diego.Perez
	 * @date 11/26/2020
	 */
	public isSavingDocument(index: number) {
		
		if (index === this.buttonActioning) {
			return true;
		} else {
			return false;
		};
	}

	profileDocuments = new FormGroup({
		Passport: new FormControl(''),
		Certificate: new FormControl(''),
		Transcript: new FormControl('')
	});

	ngOnInit() {
	}

	/**
	 * Method to call all the documents relate it.
	 * @author Diego.Perez
	 */
	loadDocuments(applicantId: number) {

		let url: string;
		let flag: boolean = false;
		//console.log('THAPLICANT ID NUMBER: ', applicantId)
		if (!Number.isNaN(applicantId)) {
			//console.log('THE APPLICANTID: ', applicantId)
			url = '/Applicant/ListSupportDocuments/' + applicantId;
			flag = true;
		} else if (this.profile != null && this.profile.applicantId > 0) {
			//console.log('THE PROFILE APPLICANT ID: ', this.profile.applicantId)
			url = '/Applicant/ListSupportDocuments/' + this.profile.applicantId;
			flag = true;
		}

		if (flag) {
			this.service.getService(url).subscribe(
				(res) => {
					//console.log('THIS IS THE DOCUMENTS INFORMATION: ', res.data)
					this.loadDocumentsCards(res.data);
				},
				(err) => {
					console.log(err)
				}
			)
		}
	}

	/**
	 * Method to fill all the documents information to show it the final user.
	 * 
	 * @param data this is the information documents
	 * @author Diego.Perez.
	 * @date 07/23/2019.
	 */
	loadDocumentsCards(data) {
		this.profile.documentList = new Array<Documento>();
		data.forEach(element => {

			let docu: Documento = new Documento();

			docu.applicantId = element.applicantId;
			docu.id = element.id;
			docu.typeDoc = element.typeDoc;
			docu.documentLocation = element.documentLocation;
			docu.documentName = element.documentName;
			docu.uploaded = element.uploaded;
			docu.documentDescription = element.documentDescription.substr(element.documentDescription.indexOf(':') + 1, element.documentDescription.length);
			docu.doctype = element.documentDescription.substr(0, element.documentDescription.indexOf(':'));
			docu.indications = 'Could you please upload a clear document of ' + element.documentDescription.substr(element.documentDescription.indexOf(':') + 1, element.documentDescription.length);

			this.profile.documentList.push(docu);
		});

	}

	/**
	 * Function to get information from the document.
	 * 
	 * @param event object that allows to get the info from the document.
	 * @author Diego.Perez
	 * @date 07/04/2019.
	 */
	onDocumentChange(event, id) {

		this.buttonActioning = id;

		if (this.profile.documentList == null)
			this.profile.documentList = new Array<Documento>();

		let document = new Documento();

		if (event.target.files.length > 0) {

			const file = event.target.files[0];
			//document.documentName = event.target.files[0].name;
			this.profile.documentList[id].documentName = event.target.files[0].name;//.substr(0, event.target.files[0].name.indexOf('.'));

			if (file.type == 'application/pdf') {
				this.profile.documentList[id].file = file;

				switch (event.target.name) {

					case 'Passport':
						this.profileDocuments.get('Passport').setValue(file);
						break;

					case 'englishTest':

						this.profileDocuments.get('englishTest').setValue(file);

						break;

					default:
						break;
				}


				this.saveNewDocument(this.profile.documentList[id]);
			} else {
				this.toast.showNotification('top', 'right', 'warning', 'The document must be a pdf.');
			}
		}
	}

	/**
	 * Method to save the document in the database.
	 * 
	 * @param documento this is the object that containt every detail of the document.
	 * @author Diego.Perez.
	 * @date 07/23/2019.
	 */
	saveNewDocument(documento: Documento) {

		let url: string = '/Applicant/fileUpload?ApplicantID=' + documento.applicantId + '&TableID=' + documento.id + '&TypeDoc=' + documento.typeDoc;
		const formData = new FormData();
		formData.append('file', documento.file);
		//this.isSavingDocument = true;
		this.service.postFile(url, formData).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					documento.documentLocation = res.data[0].documentLocation;
					documento.documentName = res.data[0].documentName;
					this.toast.showNotification('top', 'right', 'success', 'The document was saved successfully.');
				}
				this.buttonActioning = -1;
			},
			(err) => {
				this.toast.showNotification('top', 'right', 'danger', err.error.message);
				this.buttonActioning = -1;
			}
		)
	}

	/**
	 * Function to obtain information from the document view click.
	 * 
	 * @param event Object that containt the information.
	 * @param id document id.
	 * @author Diego.Perez.
	 * @date 07/27/2019.
	 */
	downloadDocument(event, id) {
		event.preventDefault();

		let data = {
			'DocumentName': this.profile.documentList[id].documentName,
			'TypeDoc': this.profile.documentList[id].typeDoc,
			'ApplicantId': this.profile.documentList[id].applicantId
		};

		let url: string = '/Applicant/fileDownload';

		this.service.downloadFile(url, data).subscribe(
			(response) => {
				this.downLoadFile(response.body, response.body.type);
			},
			(err) => {
				this.toast.showNotification('top', 'right', 'danger', 'An error ocurred trying to download the document.');
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
			this.toast.showNotification('top', 'right', 'success', 'Please disable your Pop-up blocker and try again.');
		}
	}

	/**
	 * Method to allow the user to delete any document that updload by error.
	 * 
	 * @param event 
	 * @param id
	 * @author Diego.Perez.
	 * @date 28/07/2019. 
	 */
	deleteDocument(event, id) {
		event.preventDefault();

		let url: string = '/Applicant/fileDelete';
		let data = {
			'DocumentName': this.profile.documentList[id].documentName,
			'ApplicantID': this.profile.documentList[id].applicantId,
			'TableID': this.profile.documentList[id].id,
			'TypeDoc': this.profile.documentList[id].typeDoc
		};

		this.service.deleteFile(url, data).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					this.profile.documentList[id].documentLocation = "";
					this.profile.documentList[id].documentName = "";
					this.toast.showNotification('top', 'right', 'success', 'The document was deleted successfully.');
				}
			},
			(err) => {
				this.toast.showNotification('top', 'right', 'danger', 'An error ocurred trying to delete the document.');
			}
		)
	}

}
