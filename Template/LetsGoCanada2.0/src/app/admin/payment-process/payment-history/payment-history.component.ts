import { Component, OnInit } from '@angular/core';
import { PaymentHistory } from 'src/app/models/paymentHistory';
import { GeneralService } from 'src/app/services/general.service';
import { ComunicationService } from 'src/app/services/comunication.service';

@Component({
	selector: 'app-payment-history',
	templateUrl: './payment-history.component.html',
	styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {

	public paymentHistory: PaymentHistory;
	public stateList;
	public spinner: boolean = false;


	constructor(private service: GeneralService, private comunication: ComunicationService) { }

	ngOnInit() {
		this.paymentHistory = new PaymentHistory();
		// console.log(this.paymentHistory);
		this.fillPaymentStatus();


	}

	/**
	 * @author Diego.Perez
	 * @date 05/11/2020
	 */
	fillPaymentStatus() {
		let url: string = '/payment/getPaymentStatusList';

		this.service.getService(url).subscribe(
			(res) => {
				//console.log(res)
				this.stateList = res.data;
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * @param paymentForm 
	 * @author Diego.Perez
	 * @date 05/11/2020
	 */
	onSubmit(paymentForm) {
		if (this.paymentHistory.date) {
			let mydate: Date = new Date(this.paymentHistory.date.toLocaleDateString());
			this.paymentHistory.date = mydate;
		}
		// console.log('true or false? >>>>', this.isSpinning);
		this.comunication.sendProcess(this.paymentHistory);
	}

	/**
	 * @param paymentForm 
	 * @author Diego.Perez
	 * @
	 */
	clearForm(paymentForm) {
		paymentForm.resetForm();
		this.paymentHistory = new PaymentHistory();
		this.comunication.sendProcess(this.paymentHistory);
	}

	isSpinning(spinner: boolean) {
		this.spinner = spinner;
	}

}
