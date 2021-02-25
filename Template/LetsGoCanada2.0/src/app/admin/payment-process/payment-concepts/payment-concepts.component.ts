import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { PaymentConcept } from 'src/app/models/paymentConcept';
import { ComunicationService } from 'src/app/services/comunication.service';
import { showNotification } from 'src/app/toast-message/toast-message';
import { ConfigTable } from 'src/app/models/configTable';
@Component({
	selector: 'app-payment-concepts',
	templateUrl: './payment-concepts.component.html',
	styleUrls: ['./payment-concepts.component.css']
})
export class PaymentConceptsComponent implements OnInit {

	public configTable: ConfigTable = {
		url: '/payment/getPaymentConceptsList',
		headerRow: ['Concept Name', 'Description', 'WU Service', 'Billable', 'Actions'],
		columnsName: ['conceptName', 'description', 'wuserviceId', 'billable', 'actions'],
		hasEditAction: true,
		tableTitle: "Payment Concept List"
	};

	public btnName: string = 'Save';
	public payment: PaymentConcept;
	public isSearching: boolean = false;

	constructor(private service: GeneralService, private comunication: ComunicationService) { }

	ngOnInit() {
		this.payment = new PaymentConcept();
	}

	/**
	 * 
	 * @param item 
	 * @author Diego.Perez
	 * @date 05/04/2020
	 */
	setObjectSelected(item) {
		this.btnName = 'Update';
		this.payment.conceptId = item.conceptId;
		this.payment.conceptName = item.conceptName;
		this.payment.description = item.description;
		this.payment.wuserviceId = item.wuserviceId;
		this.payment.billable = item.billable;
	}

	/**
	 * 
	 * @param paymentForm 
	 * @author Diego.Perez
	 * @date 05/04/2020
	 */
	onSubmit(paymentForm) {

		if (paymentForm.valid) {
			let url: string = '/payment/setPaymentConcept';
			this.isSearching = true;
			this.service.post(url, this.payment).subscribe(
				(res) => {

					if (res.message == 'Ok') {
						this.payment = new PaymentConcept();
						paymentForm.resetForm();
						showNotification('top', 'right', 'success', 'The payment concept was ' + this.btnName.toString().toLowerCase() + 'd successfully.')
						this.btnName = 'Save';
						this.comunication.sendProcess(res);
					}
					this.isSearching = false;
				},
				(err) => {
					console.log(err);
					showNotification('top', 'right', 'danger', 'An error ocurred trying to save the payment concept.');
					this.isSearching = true;
				}
			)
		} else {
			showNotification('top', 'right', 'warning', 'Fill the required input fields.')
		}
	}

	/**
	 * @param paymentForm 
	 * @author Diego.Perez
	 * @date 05/05/2020
	 */
	clearForm(paymentForm) {
		this.payment = new PaymentConcept();
		paymentForm.resetForm();
		this.btnName = 'Save';
	}

}
