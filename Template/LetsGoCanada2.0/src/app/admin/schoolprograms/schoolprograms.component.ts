import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { ActivatedRoute } from '@angular/router';
import { TableData } from 'src/app/md/md-table/md-table.component';
import { ProgramSch } from 'src/app/models/programsch';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';
import { ErrorStateMatcher, MatSelectChange } from '@angular/material';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { ProgramCost } from 'src/app/models/programcost';
import { ProgramDetail } from 'src/app/models/programdetail';
import { ProgramAdmissionDetail } from 'src/app/models/programAdmissionDetail';
import { Schoolm } from 'src/app/models/schoolm';
import { Program } from 'src/app/models/program';
import { Programm } from 'src/app/models/programm';
import { showNotification } from 'src/app/toast-message/toast-message';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoObj } from 'src/app/models/videoObj';
import { isNullOrUndefined } from 'util';



declare const $: any;

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
	selector: 'app-schoolprograms',
	templateUrl: './schoolprograms.component.html',
	styleUrls: ['./schoolprograms.component.css']
})
export class SchoolprogramsComponent implements OnInit {

	//programtype: FormGroup;
	costType: FormGroup;
	detailsType: FormGroup;
	mediaType: FormGroup;
	requiremenType: FormGroup;
	public buttonName: string = 'Save';
	public buttonNameModal: string = 'Save';
	public programList;
	public tableData1: TableData;
	public program: ProgramSch;
	public schoolId;
	public termList;
	public programsPerTerm;
	public pageOfItems;
	public schoolName = '';
	public programCost: ProgramCost;
	public programName: string = '';
	public programDetails: ProgramDetail;
	public programMedia;
	public educationLevels;
	public mediaButton: string = 'Select Image';
	public selectedProgramName: string;
	private programId: string;
	public programNameForVideo: string;
	public programsType = [];
	public programDiscipline = [];
	public loading: boolean = false;
	public programStatus = [
		{ 'id': 1, 'name': 'Open' },
		{ 'id': 0, 'name': 'Close' }
	];

	public progra: Programm;
	public prograSearch: Programm;
	public ietlsTypeList;
	public toefelTypeList;
	public newValidProgramRegister: boolean = false;

	public paymentConcepts: any;
	public applicationCost: any;
	public btnLabel: string = 'ADD';
	conceptForm = new FormGroup({
		applicationCostID: new FormControl(null),
		conceptSelected: new FormControl(null),
		amount: new FormControl({ value: null, disabled: true }),
		visible: new FormControl(null),
	});
	public conceptTableHeaders = ['Concept', 'Amount', 'Billable', 'Visible', 'Action'];
	public isVisible = [true, false];

	@ViewChild('videoUrlForm') formValues;
	private programIdForVideo: number;
	public videoLinkSanitized: SafeResourceUrl;
	public videoUrl: Array<VideoObj> = [];
	public whosWorking: string = '';

	editorConfig = {
		"editable": true,
		"spellcheck": true,
		"height": "auto",
		"minHeight": "0",
		"width": "auto",
		"minWidth": "0",
		"translate": "yes",
		"enableToolbar": true,
		"showToolbar": true,
		"placeholder": "Enter text here...",
		"imageEndPoint": "",
		"toolbar": [
			["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
			// ["fontName", "fontSize", "color"],
			["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
			["cut", "copy", "delete", "removeFormat", "undo", "redo"],
			["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"]
			// ,
			// ["link", "unlink", "image", "video"]
		]
	}

	constructor(private service: GeneralService,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private renderer: Renderer2,
		private sanitizer: DomSanitizer) {
		this.progra = new Programm();
		this.prograSearch = new Programm();
		this.progra.schoolId = Number.parseInt(this.route.snapshot.paramMap.get('id'));
		this.prograSearch.schoolId = this.progra.schoolId;
		this.loadPrograms();
		this.getTermsList();
		this.getProgramsType();
		this.getProgramsDiscipline();
		this.loadEducationLevels();
		this.getIeltsTypes();
		this.getToefelTypes();
	}

	/**
	 * Method to define the accion to show the spinner.
	 * @param paramet 
	 * @author Diego.Perez
	 * @date 12/07/2020
	 */
	onPopUpDoing(paramet: string) {
		if (!isNullOrUndefined(paramet) && paramet == this.whosWorking) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * @author Diego.Perez
	 * @date 12/06/2019
	 */
	getProgramsDiscipline() {
		let url: string = '/School/getDisciplineList';

		this.service.getService(url).subscribe(
			(res) => {
				this.programDiscipline = res.data;

			},
			(err) => {

			}
		)
	}

	/**
	 * @author Deivid Mafra
	 * @date 05/08/2020
	 */
	getPaymentConcepts = () => {
		let url = '/School/getPaymentConcepts';
		this.service.getService(url).subscribe(
			res => {
				this.paymentConcepts = res.data;
				// console.log('res', res);
			},
			err => {
				console.log('err', err);
			}
		)

	}

	/**
	 * @author Deivid Mafra
	 * @date 05/08/2020
	 */
	selectConceptChange(event: MatSelectChange) {
		if (event === undefined || event == null) {
			this.conceptForm.get('amount').disable();
			// console.log('event', event)
		} else {
			this.conceptForm.get('amount').enable();
			// console.log('event', event)
		}
	}

	/**
	 * @author Deivid Mafra
	 * @date 05/08/2020
	 */
	AddConcept = () => {
		this.btnLabel = "ADD";
		let url = '/School/setApplicationCost';
		let data: any;
		let message: string;

		if (this.conceptForm.get('applicationCostID').value === undefined || this.conceptForm.get('applicationCostID').value == null) {
			data = [{
				"applicationCostId": 0,
				"programId": this.programId,
				"conceptId": this.conceptForm.get('conceptSelected').value,
				"amount": this.conceptForm.get('amount').value,
				"visible": this.conceptForm.get('visible').value
			}];
			message = 'Concept added successfully!';

		} else {
			data = [{
				"applicationCostId": this.conceptForm.get('applicationCostID').value,
				"programId": this.programId,
				"conceptId": this.conceptForm.get('conceptSelected').value,
				"amount": this.conceptForm.get('amount').value,
				"visible": this.conceptForm.get('visible').value
			}];
			message = 'Concept updated successfully!';
		}
		this.whosWorking = 'addConcep';
		this.service.post(url, data).subscribe(
			res => {
				if (res.message == "Ok") {
					this.applicationCost = res.data
					showNotification('top', 'right', 'success', message);
				}
				this.whosWorking = '';
			},
			err => {
				console.log('err', err)
				this.whosWorking = '';
			}
		)

		this.conceptForm.reset();
		this.conceptForm.get('amount').disable();
	}

	/**
	 * @author Deivid Mafra
	 * @date 05/08/2020
	 */
	editConcept = concept => {
		this.btnLabel = "UPDATE";
		// console.log(concept);
		this.conceptForm.get('amount').enable();
		this.conceptForm.get('applicationCostID').setValue(concept.applicationCostId);
		this.conceptForm.get('conceptSelected').setValue(concept.conceptId);
		this.conceptForm.get('amount').setValue(concept.amount);
		this.conceptForm.get('visible').setValue(concept.visible);
		// console.log('this.conceptForm.get(applicationCostID).value', this.conceptForm.get('applicationCostID').value)
	}

	/**
	 * @author Deivid Mafra
	 * @date 05/08/2020
	 */
	getApplicationCost = programId => {
		let url = '/School/getApplicationCost/' + programId;

		this.service.getService(url).subscribe(
			res => {
				this.applicationCost = res.data;
				// console.log('applicationCost', res);
			}
		)
	}

	deleteConcept = (id, conceptName) => {
		let url: string = '/school/deleteApplicationCost/' + id;
		this.whosWorking = conceptName;
		this.service.delete(url).subscribe(
			(res) => {
				this.applicationCost = this.applicationCost.filter(cost => cost.applicationCostId !== id)
				showNotification('top', 'right', 'success', `Concept ${conceptName} deleted successfully!`);
				this.whosWorking = '';
			},
			(err) => {
				console.log(err);
				showNotification('top', 'right', 'danger', err.error.message);
				this.whosWorking = '';
			});
	}

	/**
	 * @author Deivid Mafra
	 * @date 05/08/2020
	 */
	getProgramInfo = program => {
		this.programName = program.name;
		this.programId = program.programId;
		// console.log(program);
	}

	/**
	 * @author Diego.Perez
	 * @date 12/06/2019
	 */
	getProgramsType() {
		let url: string = '/School/gettypeofprogram';

		this.service.getService(url).subscribe(
			(res) => {

				this.programsType = res.data;

			},
			(err) => {

			}
		)
	}

	/**
	 * 
	 * @param pageOfItems 
	 * @author Diego.Perez
	 * @date 09/17/2019
	 */
	onChangePage(pageOfItems) {
		this.pageOfItems = pageOfItems;
	}

	/**
	 * @author Diego.Perez.
	 * @date 02/20/2020
	 */
	inputFormControl = new FormControl('', [
		Validators.required
	]);

	isFieldValid(form: FormGroup, field: string) {
		return !form.get(field).valid && form.get(field).touched;
	}

	displayFieldCss(form: FormGroup, field: string) {
		return {
			'has-error': this.isFieldValid(form, field),
			'has-feedback': this.isFieldValid(form, field)
		};
	}

	/**
	 * @author Diego.Perez
	 * @date 02/20/2020
	 */
	newProgramValidationRegister(e) {
		if (e == null || e.length > 5) {
			this.newValidProgramRegister = true;
		} else {
			this.newValidProgramRegister = false;
		}
	}

	ngOnInit() {

		// this.getApplicationCost(100);
		this.getPaymentConcepts();



		this.program = new ProgramSch();
		this.progra = new Programm();

		this.tableData1 = {
			headerRow: ['Name', 'Type Program', 'School Name', 'Actions'],
			dataRows: [
				['Dakota Rice', 'Niger', 'Oud-Turnhout', '$36,738']
			]
		};

		// this.programtype = this.formBuilder.group({

		// 	programName: [null, Validators.required],
		// 	typeProgram: [null, Validators.required],
		// 	discipline: [null, Validators.required]

		// });

		this.costType = this.formBuilder.group({

			appFees: [null, Validators.required],
			tuition: [null, Validators.required],
			boSupplies: [null, Validators.required],
			costYear: [null, Validators.required],
			totalTuition: [null, Validators.required],
			totalAdditionalFees: [null, Validators.required]
		});

		this.detailsType = this.formBuilder.group({

			duration: [null, Validators.required],
			//progType: [null, Validators.required],
			avProTime: [null, Validators.required],
			description: [null, Validators.required]
		});

		this.mediaType = this.formBuilder.group({
			mediaImage: [null, Validators.required]
		});

		this.requiremenType = this.formBuilder.group({
			mingpa: [null, Validators.required],
			listeningIEL: [null, Validators.required],
			readingIEL: [null, Validators.required],
			speakingIEL: [null, Validators.required],
			writingIEL: [null, Validators.required],
			listeningTOE: [null, Validators.required],
			readingTOE: [null, Validators.required],
			speakingTOE: [null, Validators.required],
			writingTOE: [null, Validators.required],
			levEducation: [null, Validators.required],
			specialNotes: [null, Validators.required],
			typeIEL: [null, Validators.required],
			typeTOE: [null, Validators.required],
			ieltsOverall: [null, Validators.required],
			toeflOverall: [null, Validators.required]
		});
	}

	/**
	 * @author Diego.Perez.
	 * @date 08/31/2019
	 */
	loadPrograms() {
		//let program: ProgramSch = new ProgramSch();
		//program.schoolId = Number.parseInt(this.route.snapshot.paramMap.get('id'));

		this.schoolId = this.route.snapshot.paramMap.get('id');
		//this.schoolId = this.route.snapshot.queryParams.id;
		this.schoolName = this.route.snapshot.paramMap.get('schoolName');;
		let url: string = '/School/getProgramListSchool/' + this.schoolId;
		//let url: string = '/School/getProgramAdmissionDetails/' + this.schoolId;
		//console.log(this.route.snapshot.queryParams.id)
		this.service.getService(url).subscribe(
			(res) => {

				if (res.message == 'Ok') {
					this.programList = res.data;
					// console.log('this.programList', this.programList)
					// this.schoolName = res.data[0].schoolName;
				}

			},
			(err) => {
				// console.log(err)
			}
		);
	}

	cleanSearchProgram() {
		this.prograSearch = new Programm();
		this.prograSearch.schoolId = Number.parseInt(this.route.snapshot.paramMap.get('id'));
		this.loadPrograms();
	}

	searchProgram() {
		let url: string = '/School/getProgramListSchoolSearch';

		this.prograSearch.name = this.prograSearch.name == null ? "" : this.prograSearch.name;

		this.service.post(url, this.prograSearch).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					this.programList = res.data;
				}
			},
			(err) => {
				console.log(err)
			}
		);
	}

	/**
	 * @author Diego.Perez
	 * @date 11/07/2019
	 */
	loadEducationLevels() {
		let url: string = '/Applicant/getEducationTypeList';
		this.service.getService(url).subscribe(
			(res) => {

				this.educationLevels = res.data;
			},
			(err) => {
				console.log(err)
			}
		);
	}

	/**
	 * 
	 * @param index 
	 * @author Diego.Perez
	 * @date 08/31/2019
	 */
	// editProgram(index) {
	// 	this.program = new ProgramSch();
	// 	this.program = this.programList[index];

	// 	//console.log(this.program.typeOfProgramId);

	// 	this.programtype.get('programName').setValue(this.program.name);
	// 	this.programtype.get('typeProgram').setValue(this.program.typeOfProgramId);
	// 	this.programtype.get('discipline').setValue(this.program.disciplineId);

	// 	this.buttonName = 'Update';
	// }
	editProgram(program: Programm) {
		// this.program = program
		// this.programtype.get('programName').setValue(this.program.name);
		// this.programtype.get('typeProgram').setValue(this.program.typeOfProgramId);
		// this.programtype.get('discipline').setValue(this.program.disciplineId);
		this.progra = program;
		this.buttonName = 'Update';
	}

	/**
	 * @author Diego.Perez
	 * @date 09/25/2019
	 */
	closeCostModal() {
		this.clearForm();
		$('#noticeModal').modal('toggle');
		this.costType.reset();
	}

	/**
	 * @author Diego.Perez.
	 * @date 11/05/2019
	 */
	closeRequirementModal() {
		this.clearForm();
	}

	closeDetailsModal() {
		this.clearForm();
		$('#detailsType').modal('toggle');
		this.detailsType.reset();
	}

	/**
	 * 
	 * @author Diego.Perez.
	 * @date 09/02/2019
	 */
	clearForm() {
		// this.programtype.get('programName').setValue('');
		// this.programtype.get('typeProgram').setValue(-1);
		// this.programtype.get('discipline').setValue(-1);

		this.costType.get('appFees').setValue('');
		this.costType.get('tuition').setValue('');
		this.costType.get('boSupplies').setValue('');
		this.costType.get('costYear').setValue('');

		//this.detailsType.get('progType').setValue('');
		this.detailsType.get('duration').setValue('');
		this.detailsType.get('description').setValue('');
		this.detailsType.get('avProTime').setValue('');

		this.programCost = null;
		this.programDetails = null;

		this.requiremenType.get('mingpa').setValue('');

		this.program = new ProgramSch();
		this.progra = new Programm();
		$("#programtype")[0].reset();
		this.buttonName = 'Save';
		this.buttonNameModal = 'Save';
		//this.programtype.reset();

		this.detailsType.reset();

	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 09/02/2019
	 */
	sendProgram(formType) {

		if (formType.valid) {
			let url: string = '/School/setProgram';

			if (this.buttonName == 'Save') {
				if (this.progra == null)
					this.progra = new Programm();

				this.progra.schoolId = this.schoolId;
			}

			this.whosWorking = 'save';
			this.service.post(url, this.progra).subscribe(
				(res) => {
					if (res.message == 'Ok') {
						if (this.buttonName == 'Save') {							
							showNotification('top', 'right', 'success', 'The program was saved correctly.');
						} else {
							showNotification('top', 'right', 'success', 'The program was updated correctly.');
						}

						this.progra = new Programm();
						formType.reset();
						this.loadPrograms();
						this.clearForm();						
					}

					this.whosWorking = '';
				},
				(err) => {
					showNotification('top', 'right', 'danger', 'An error ocurred trying to save the program.');
					this.whosWorking = '';
				}
			)
		} else {
			showNotification('top', 'right', 'danger', 'Please fill out the form correctly.');
		}
	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 09/02/2019
	 */
	// getProgramChanges() {

	// 	if (this.program == null) {
	// 		this.program = new ProgramSch();
	// 	}

	// 	this.program.name = this.programtype.get('programName').value;
	// 	this.program.typeOfProgramId = this.programtype.get('typeProgram').value;
	// 	this.program.disciplineId = this.programtype.get('discipline').value;
	// }

	/**
	 * 
	 * @param index 
	 * @author Diego.Perez
	 * @date 09/04/2019
	 */
	// showProgramCost(prog) {

	// 	if (this.programCost == null) {
	// 		this.programCost = new ProgramCost();

	// 	} else {
	// 		this.buttonNameModal = 'Update';
	// 	}

	// 	this.programCost.programId = prog.programId;
	// 	this.getProgramCost(prog.programId);
	// 	this.programName = prog.name;
	// 	//this.programsPerTerm = this.programList[index].programsPerTerm;
	// 	this.programsPerTerm = prog.programsPerTerm;
	// }

	/**
	 * 
	 * @param index
	 * @author Diego.Perez
	 * @date 10/15/2019
	 */
	// showMediaDetails(index) {
	// 	console.log(index)
	// 	this.program = index;
	// 	this.programName = index.name; //this.programList[index].name;
	// 	this.getMediaPerProgram(index);
	// }

	/**
	 * @author Diego.Perez
	 * @date 11/05/2019
	 */
	showProgramRequirements(prog) {

		this.fillProgramRequirements(prog.programAdmissionDetails);
		this.programName = prog.name;
		this.program = prog;
	}

	/**
	 * @param program 
	 * @author Deivid Mafra
	 * @date 12/02/2020.
	 */
	showVideo = (program) => {
		this.videoUrl = [];
		this.programIdForVideo = program.programId;
		this.programNameForVideo = program.name;

		let url: string = '/media/getProgramVideoURL/' + program.programId;

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

	/**
	 * @param formValues 
	 * @author Deivid Mafra
	 * @date 12/02/2020.
	 */
	setVideo = ({ value }: { value: any }) => {

		let videoObject = {
			"MediaRowID": 0,
			"ResourceID": this.programIdForVideo,
			"ResourceURL": value.videoUrl
		}

		let url: string = '/media/setProgramVideoURL';
		this.whosWorking = 'addvideo';
		this.service.post(url, videoObject).subscribe(
			res => {
				if (res.message == 'Ok') {
					this.formValues.resetForm();
					this.videoLinkSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(res.data[0].mediaLocation);
					let videoObj = new VideoObj();
					videoObj.mediaId = res.data[0].programMediaId;
					videoObj.mediaUrl = this.videoLinkSanitized;
					this.videoUrl.push(videoObj);
					showNotification('top', 'right', 'success', 'Video url saved successfully');

				} else {
					showNotification('top', 'right', 'danger', res.message);
				}
				this.whosWorking = '';
			},
			(err) => {
				console.log(err)
				this.whosWorking = '';
			}
		);
	}

	/**
	 * @param mediaId 
	 * @author Deivid Mafra
	 * @date 12/02/2020.
	 */
	deleteVideo = (mediaId: number) => {

		let videoObject = {
			"MediaRowID": mediaId,
		}

		let url: string = '/media/deleteProgramVideoURL';
		this.whosWorking = mediaId.toString();
		this.service.delete(url, videoObject).subscribe(
			res => {
				if (res.message == 'Ok') {
					showNotification('top', 'right', 'success', 'Video deleted successfully');
					this.videoUrl = this.videoUrl.filter(video => res.data[0].programMediaId != video.mediaId);

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
	 * @author Diego.Perez
	 * @date 11/08/2019
	 */
	fillProgramRequirements(requirement) {
		this.requiremenType.reset();
		this.buttonNameModal = 'Save';
		if (requirement) {
			this.requiremenType.get('writingTOE').setValue(requirement.toelfWriting);
			this.requiremenType.get('speakingTOE').setValue(requirement.toelfSpeaking);
			this.requiremenType.get('readingTOE').setValue(requirement.toelfReading);
			this.requiremenType.get('listeningTOE').setValue(requirement.toelfListening);
			this.requiremenType.get('writingIEL').setValue(requirement.ieltsWriting);
			this.requiremenType.get('speakingIEL').setValue(requirement.ieltsSpeaking);
			this.requiremenType.get('readingIEL').setValue(requirement.ieltsReading);
			this.requiremenType.get('listeningIEL').setValue(requirement.ieltsListening);
			this.requiremenType.get('levEducation').setValue(requirement.lastEducationTypeId);
			this.requiremenType.get('mingpa').setValue(requirement.gpa);
			this.requiremenType.get('specialNotes').setValue(requirement.notes);

			this.requiremenType.get('typeIEL').setValue(requirement.ieltsType);
			this.requiremenType.get('typeTOE').setValue(requirement.toeflType);
			this.requiremenType.get('ieltsOverall').setValue(requirement.ieltsOverall);
			this.requiremenType.get('toeflOverall').setValue(requirement.toeflOverall);

			this.buttonNameModal = 'Update';
		}
	}

	/**
	 * @author Diego.Perez
	 * @date 10/15/2019
	 */
	getMediaPerProgram(program) {
		this.programMedia = null;
		let url: string = '/school/getProgramMedia/' + program.programId;

		this.programId = program.programId;


		this.service.getService(url).subscribe(
			(res) => {

				this.programMedia = res.data[0];
				//console.log(res); //mediaLocation
				this.selectedProgramName = program.name;
			},
			(err) => {
				// console.log(err)
				showNotification('top', 'right', 'danger', 'An error ocurred trying to get the media per program!');
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 10/15/2019
	 */
	closeMediaModal() {
		this.programMedia = null;
		this.mediaType.reset();
	}

	/**
	 * 
	 * @param index 
	 * @author Diego.Perez
	 * @date 09/24/2019
	 */
	showProgramDetails(prog) {

		if (this.programDetails == null) {
			this.programDetails = new ProgramDetail();
		} else {
			this.buttonNameModal = 'Update';
		}
		// this.programDetails.programId = this.programList[index].programId;
		// this.programName = this.programList[index].name;
		// this.getProgramDetails(this.programList[index].programId);
		this.programDetails.programId = prog.programId;
		this.programName = prog.name;
		this.getProgramDetails(prog.programId);

		this.programDetails.programId = prog.programId;
		this.programName = prog.name;
		this.getProgramDetails(prog.programId);

	}

	/**
	 * 
	 * @param $event 
	 * @author Diego.Perez
	 * @date 10/15/2019
	 */
	onDocumentChange(event) {

		const file = event.target.files[0];
		const formData = new FormData();
		formData.append('file', file);
		//this.loading = true;

		let url: string = '/school/setProgramMedia?programID=' + this.programId + '&MediaTypeID=2';
		this.whosWorking = 'media';
		this.service.postFile(url, formData).subscribe(
			(res) => {
				
				showNotification('top', 'right', 'success', 'New media saved correctly!');
				$('#mediaModal').modal('hide');
				//this.loading = false;
				this.whosWorking = '';
			},

			(err) => {
				showNotification('top', 'right', 'danger', err.error.message);
				this.whosWorking = '';
			}
		)
	}

	/**
	 * 
	 * @param programId 
	 * @author Diego.Perez
	 * @date 09/24/2019
	 */
	getProgramDetails(programId: number) {
		let url: string = '/school/GetProgram/' + programId;

		this.service.getService(url).subscribe(
			(res) => {
				if (res.message = 'Ok') {
					if (res.data[0].programDetails != null) {
						this.programDetails = res.data[0].programDetails;
					}

					// console.log(res.data[0]);
					this.fillProgramDetails();
					// if(this.programCost) {
					// 	this.programName = this.programCost.name;
					// }
				}
			},
			(err) => {
				// console.log(err)
				showNotification('top', 'right', 'danger', 'An error ocurred trying to get the program detail information.');
			}
		)
	}

	/**
	 * 
	 * @param programId
	 * @author Diego.Perez
	 * @date 09/24/2019
	 */
	getProgramCost(programId: number) {

		let url: string = '/school/GetProgram/' + programId;

		this.service.getService(url).subscribe(
			(res) => {
				if (res.message = 'Ok') {
					if (res.data[0].programCost != null) {
						this.programCost = res.data[0].programCost;
					}

					// console.log('*****************************')
					// console.log(res.data[0]);
					this.fillProgramCost();
					// if(this.programCost) {
					// 	this.programName = this.programCost.name;
					// }
				}
			},
			(err) => {
				// console.log(err)
				showNotification('top', 'right', 'danger', 'An error ocurred trying to get the program cost information.');
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 09/24/2019
	 */
	fillProgramDetails() {
		if (this.programDetails) {
			this.detailsType.get('duration').setValue(this.programDetails.duration);
			this.detailsType.get('description').setValue(this.programDetails.programDescription);
			this.detailsType.get('avProTime').setValue(this.programDetails.processingTime);
		}
	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 09/24/2019
	 */
	fillProgramCost() {
		if (this.programCost) {
			this.costType.get('appFees').setValue(this.programCost.applicationFess);
			this.costType.get('tuition').setValue(this.programCost.tuitionPerYear);
			this.costType.get('boSupplies').setValue(this.programCost.booksAndSupplies);
			this.costType.get('costYear').setValue(this.programCost.costOfLivingPerYear);
			this.costType.get('totalTuition').setValue(this.programCost.totalTuition);
			this.costType.get('totalAdditionalFees').setValue(this.programCost.totalAdditionalFees);
		}
	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 09/25/2019
	 */
	programCostValues() {
		// if(this.programCost) {
		// 	this.programCost = new ProgramCost();
		// }
		//console.clear()
		// console.log(this.programCost)
		this.programCost.applicationFess = this.costType.get('appFees').value;
		this.programCost.tuitionPerYear = this.costType.get('tuition').value;
		this.programCost.booksAndSupplies = this.costType.get('boSupplies').value;
		this.programCost.costOfLivingPerYear = this.costType.get('costYear').value;

		this.programCost.totalTuition = this.costType.get('totalTuition').value;
		this.programCost.totalAdditionalFees = this.costType.get('totalAdditionalFees').value;
	}

	/**
	 * @author Diego.Perez
	 * @date 
	 */
	programDetailsValues() {
		this.programDetails.processingTime = this.detailsType.get('avProTime').value;
		this.programDetails.duration = this.detailsType.get('duration').value;
		this.programDetails.programDescription = this.detailsType.get('description').value;
	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 09/04/2019
	 */
	getTermsList() {
		let url: string = '/school/getTerms';

		this.service.getService(url).subscribe(
			(res) => {
				this.termList = res.data;
			},
			(err) => {
				// console.log(err)
				showNotification('top', 'right', 'danger', 'An error ocurred trying to get the term list.');
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 01/30/2020
	 */
	getIeltsTypes() {
		let url: string = '/school/GetIeltsTypes';

		this.service.getService(url).subscribe(
			(res) => {
				this.ietlsTypeList = res;
			},
			(err) => {
				showNotification('top', 'right', 'danger', 'An error ocurred trying to get the IELTS type list.');
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 01/30/2020
	 */
	getToefelTypes() {
		let url: string = '/school/GetToeflTypes';

		this.service.getService(url).subscribe(
			(res) => {
				this.toefelTypeList = res;
			},
			(err) => {
				showNotification('top', 'right', 'danger', 'An error ocurred trying to get the Toefl type list.');
			}
		)
	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 09/25/2019
	 */
	saveProgramCost() {
		// console.log(this.programCost)
		let url: string = '/school/setProgramCost';
		this.programCostValues();

		this.service.post(url, this.programCost).subscribe(
			(res) => {
				// console.log(res)
				if (res.message == 'Ok') {
					this.clearForm();
					$('#noticeModal').modal('toggle');
					showNotification('top', 'right', 'success', 'The program cost was saved correctly.');
				}
			},
			(err) => {
				// console.log(err)
				showNotification('top', 'right', 'danger', 'A problem ocurred trying to save the program cost.');
			}
		)
	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 09/26/2019
	 */
	saveProgramDetails() {
		this.whosWorking = 'details';
		let url: string = '/school/setProgramDetails';
		this.programDetailsValues();
		this.service.post(url, this.programDetails).subscribe(
			(res) => {

				if (res.message == 'Ok') {
					this.clearForm();
					$('#detailsModal').modal('toggle');
					showNotification('top', 'right', 'success', 'The program detail was saved correctly.');
				}
				this.whosWorking = '';
			},
			(err) => {
				this.whosWorking = '';
				showNotification('top', 'right', 'danger', 'A problem ocurred trying to save the program detail.');
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 11/06/2019
	 */
	saveProgramRequirements() {

		let data = this.fillRequirements();

		let url: string = '/school/setProgramAdmissionDetails';
		this.whosWorking = 'requirement';
		this.service.post(url, data).subscribe(
			(res) => {

				if (res.message == 'Ok') {
					this.updateRequirement(res.data);
					this.requiremenType.reset();
					$('#requirementModal').modal('toggle');

					showNotification('top', 'right', 'success', 'The program requiriment was saved correctly.');
				}
				this.whosWorking = '';
			},
			(err) => {
				showNotification('top', 'right', 'danger', 'A problem ocurred trying to save the program requirement.');
				this.whosWorking = '';
			}
		)
	}

	/**
	 * 
	 * @param data 
	 * @author Diego.Perez
	 * @date 12/10/2019
	 */
	updateRequirement(rpt) {
		//console.log('que es lo que esta pasando')
		this.programList.forEach(element => {

			//console.log("rpt[0].toelfWriting", rpt[0].toelfWriting)


			if (parseInt(element.programId) === parseInt(rpt[0].programId)) {

				if (element.programAdmissionDetails == null) {
					element.programAdmissionDetails = new ProgramAdmissionDetail();
				}

				element.programAdmissionDetails.toelfWriting = rpt[0].toelfWriting;
				element.programAdmissionDetails.toelfSpeaking = rpt[0].toelfSpeaking;
				element.programAdmissionDetails.toelfReading = rpt[0].toelfReading;
				element.programAdmissionDetails.toelfListening = rpt[0].toelfListening;

				element.programAdmissionDetails.ieltsListening = rpt[0].ieltsListening;
				element.programAdmissionDetails.ieltsReading = rpt[0].ieltsReading;
				element.programAdmissionDetails.ieltsSpeaking = rpt[0].ieltsSpeaking;
				element.programAdmissionDetails.ieltsWriting = rpt[0].ieltsWriting;


				element.programAdmissionDetails.ieltsType = rpt[0].ieltsType;
				element.programAdmissionDetails.toeflType = rpt[0].toeflType;
				element.programAdmissionDetails.ieltsOverall = rpt[0].ieltsOverall;
				element.programAdmissionDetails.toeflOverall = rpt[0].toeflOverall;


				element.programAdmissionDetails.notes = rpt[0].notes;
				element.programAdmissionDetails.gpa = rpt[0].gpa;
				element.programAdmissionDetails.lastEducationTypeId = rpt[0].lastEducationTypeId;


			}
		});
	}

	/**
	 * @author Diego.Perez
	 * @date 11/06/2019 
	 */
	fillRequirements() {

		let data = {
			"ProgramId": this.program.programId,
			"Toefl": true,
			"Ielts": true,
			"ToelfWriting": this.requiremenType.get('writingTOE').value != null ? this.requiremenType.get('writingTOE').value : null,
			"ToelfSpeaking": this.requiremenType.get('speakingTOE').value != null ? this.requiremenType.get('speakingTOE').value : null,
			"ToelfReading": this.requiremenType.get('readingTOE').value != null ? this.requiremenType.get('readingTOE').value : null,
			"ToelfListening": this.requiremenType.get('listeningTOE').value != null ? this.requiremenType.get('listeningTOE').value : null,
			"IeltsWriting": this.requiremenType.get('writingIEL').value != null ? this.requiremenType.get('writingIEL').value : null,
			"IeltsSpeaking": this.requiremenType.get('speakingIEL').value != null ? this.requiremenType.get('speakingIEL').value : null,
			"IeltsReading": this.requiremenType.get('readingIEL').value != null ? this.requiremenType.get('readingIEL').value : null,
			"IeltsListening": this.requiremenType.get('listeningIEL').value != null ? this.requiremenType.get('listeningIEL').value : null,
			"LastEducationTypeId": this.requiremenType.get('levEducation').value != null ? this.requiremenType.get('levEducation').value : null,
			"Gpa": this.requiremenType.get('mingpa').value != null ? this.requiremenType.get('mingpa').value : null,
			"Notes": this.requiremenType.get('specialNotes').value != null ? this.requiremenType.get('specialNotes').value : null,
			"ieltsType": this.requiremenType.get('typeIEL').value != null ? this.requiremenType.get('typeIEL').value : null,
			"toeflType": this.requiremenType.get('typeTOE').value != null ? this.requiremenType.get('typeTOE').value : null,
			"ieltsOverall": this.requiremenType.get('ieltsOverall').value != null ? this.requiremenType.get('ieltsOverall').value : null,
			"toeflOverall": this.requiremenType.get('toeflOverall').value != null ? this.requiremenType.get('toeflOverall').value : null
		}

		return data;

	}

}
