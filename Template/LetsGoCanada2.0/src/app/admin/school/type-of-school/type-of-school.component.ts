import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TypeSchool } from 'src/app/models/typeSchool';
import { GeneralService } from 'src/app/services/general.service';
import { showNotification } from 'src/app/toast-message/toast-message';

@Component({
	selector: 'app-type-of-school',
	templateUrl: './type-of-school.component.html',
	styleUrls: ['./type-of-school.component.css']
})
export class TypeOfSchoolComponent implements OnInit {

	constructor(private typeSchoolService: GeneralService) { }

	//Type School form fields

	typeSchoolForm = new FormGroup({
		typeId: new FormControl(null, Validators.required), //only for send to database
		typeName: new FormControl('', Validators.required),
		typeDescription: new FormControl('', Validators.required)
	});

	public tableHeader: String[];
	public typeSchool: Array<TypeSchool>;
	public pageOfItems: Array<TypeSchool>;

	ngOnInit() {
		this.tableHeader = ['Type', 'Description', 'Edit'];
		this.getTypeSchool();
	}

	getTypeSchool() {
		let url = "/admin/getTypeOfSchoolList";
		this.typeSchoolService.getService(url).subscribe(
			(res) => {
				this.typeSchool = res.data;
			},
			(err) => {
				console.log(err);
			}
		)
	}

	selectTypeSchool(typeSchool: TypeSchool) {
		this.typeSchoolForm.get('typeId').setValue(typeSchool.typeId);
		this.typeSchoolForm.get('typeName').setValue(typeSchool.typeName);
		this.typeSchoolForm.get('typeDescription').setValue(typeSchool.typeDescription);
	}

	onSubmit() {
		var data: TypeSchool;
		let url: string = '/admin/setTypeOfSchool';

		if (typeof this.typeSchoolForm.get('typeId').value === undefined || this.typeSchoolForm.get('typeId').value == null) {
			data = {
				"typeId": 0,
				"typeName": this.typeSchoolForm.get('typeName').value,
				"typeDescription": this.typeSchoolForm.get('typeDescription').value
			}
			//to create a new typeSchool
			this.typeSchoolService.post(url, data).subscribe(
				(res) => {
					if (res.message == 'Ok')
						showNotification('top', 'right', 'success', 'New type of school registered successfully!');
					this.pageOfItems.unshift(res.data[0]);
					this.clearField();
				},
				(err) => {
					console.log(err)
					showNotification('top', 'right', 'danger', 'Error trying to register the new type of school!');
				})

		} else {
			data = this.typeSchoolForm.value;
			//To update a typeSchool

			let index: number = this.typeSchool.findIndex((TypeSchool: any) => TypeSchool.typeId === this.typeSchoolForm.get('typeId').value);

			this.typeSchoolService.post(url, data).subscribe(
				(res) => {

					if (res.message == 'Ok')
						showNotification('top', 'right', 'success', 'Type of school updated successfully!');
					this.getTypeSchool();
						//this.pageOfItems[index] = res.data[0];
					this.clearField();
				},
				(err) => {
					console.log(err)
					showNotification('top', 'right', 'danger', 'Error trying to update the type of school!')
				})
		}
	}

	onChangePage(pageOfItems: Array<TypeSchool>) {
		this.pageOfItems = pageOfItems;
	}

	clearField() {
		this.typeSchoolForm.reset();
	}

}



