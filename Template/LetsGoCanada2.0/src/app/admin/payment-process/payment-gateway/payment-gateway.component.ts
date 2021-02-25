import { Component, OnInit } from '@angular/core';
import { PaymentGateway } from 'src/app/models/paymentGateway';
import { GeneralService } from 'src/app/services/general.service';
import { ComunicationService } from 'src/app/services/comunication.service';
import { showNotification } from 'src/app/toast-message/toast-message';
import { ConfigTable } from 'src/app/models/configTable';
@Component({
	selector: 'app-payment-gateway',
	templateUrl: './payment-gateway.component.html',
	styleUrls: ['./payment-gateway.component.css']
})
export class PaymentGatewayComponent implements OnInit {

	public configTable: ConfigTable = {
		url: '/payment/getPaymentGatewayList',
		headerRow: ['WU Client Id', 'WU Name', 'Note', 'Active', 'Actions'],
		columnsName: ['wuclientId', 'wudomainName', 'note', 'active', 'actions'],
		hasEditAction: true,
		tableTitle: "Payment Gateway List"
	};

	public payment: PaymentGateway;
	public btnName: string = 'Save';
	public isSearching: boolean = false;

	constructor(private service: GeneralService, private comunication: ComunicationService) { }

	ngOnInit() {
		this.payment = new PaymentGateway();
	}

	/**
	 * @param item 
	 * @author Diego.Perez
	 * @date 05/05/2020
	 */
	setObjectSelected(item) {

		this.payment.paymentClientId = item.paymentClientId;
		this.payment.wuclientId = item.wuclientId;
		this.payment.wudomainName = item.wudomainName;
		this.payment.note = item.note;
		this.payment.active = item.active;
		this.btnName = 'Update';
	}

	/**
	 * @param paymentForm 
	 * @author Diego.Perez
	 * @date 05/05/2020
	 */
	onSubmit(paymentForm) {

		if (paymentForm.valid) {

			let url: string = '/payment/setPaymentGateway';
			this.isSearching = true;
			this.service.post(url, this.payment).subscribe(
				(res) => {

					if (res.message == 'Ok') {
						showNotification('top', 'right', 'success', 'The payment gateway was ' + this.btnName.toString().toLowerCase() + 'd successfully.')
						this.btnName = 'Save';
						this.payment = new PaymentGateway();
						paymentForm.resetForm();
						this.comunication.sendProcess(res);
					}
					this.isSearching = false;
				},
				(err) => {
					console.log(err)
					showNotification('top', 'right', 'danger', 'An error ocurred trying to save the payment gateway.');
					this.isSearching = false;
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
		this.payment = new PaymentGateway();
		paymentForm.resetForm();
		this.btnName = 'Save';
	}
}
