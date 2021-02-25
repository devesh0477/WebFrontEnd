import { Component, EventEmitter, OnInit, Output, SimpleChanges } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { PaymentHistory } from 'src/app/models/paymentHistory';
import { ComunicationService } from 'src/app/services/comunication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-payment-history-list',
	templateUrl: './payment-history-list.component.html',
	styleUrls: ['./payment-history-list.component.css']
})
export class PaymentHistoryListComponent implements OnInit {

	public paymentHistory: PaymentHistory;
	public paymentHistoryList: Array<PaymentHistory>;
	public pageOfItems;
	public iteraction: number = 0;
	public itemsNumber: number = 100;
	public config: any;
	@Output() spinner: EventEmitter<boolean> = new EventEmitter();
	public tableSpinner: boolean = true;
	public table

	public labels = {
		previousLabel: 'Previous',
		nextLabel: 'Next',
		screenReaderPaginationLabel: 'Pagination',
		screenReaderPageLabel: 'page',
		screenReaderCurrentLabel: `You're on page`
	};

	public maxSize: number = 10;
	public directionLinks: boolean = true;
	public autoHide: boolean = false;
	public responsive: boolean = true;

	constructor(private service: GeneralService, private comunication: ComunicationService, private route: ActivatedRoute, private router: Router) {
		this.comunication.listenerProcess().subscribe(
			(res) => {
				this.paymentHistory = new PaymentHistory();
				this.fillPayment(res);
				this.paymentHistoryList = new Array<PaymentHistory>();
				this.iteraction = 0;
				this.fillPaymentHistoryList(this.itemsNumber, this.iteraction);
			}
		)

		this.paymentHistory = new PaymentHistory();
		this.paymentHistoryList = new Array<PaymentHistory>();
		this.fillPaymentHistoryList(this.itemsNumber, this.iteraction);

		this.config = {
			currentPage: 1,
			itemsPerPage: 10,
			totalItems: this.paymentHistoryList.length
		};

		this.labels = {
			previousLabel: 'Previous',
			nextLabel: 'Next',
			screenReaderPaginationLabel: 'Pagination',
			screenReaderPageLabel: 'page',
			screenReaderCurrentLabel: `You're on page`
		};
	}

	/**
	 * 
	 * @param item 
	 * @author Diego.Perez
	 * @date 06/10/2020
	 */
	fillPayment(item: PaymentHistory) {
		if (item.paymentId != null)
			this.paymentHistory.paymentId = item.paymentId;

		if (item.previousState != null)
			this.paymentHistory.previousState = item.previousState;

		if (item.currentState != null)
			this.paymentHistory.currentState = item.currentState;

		if (item.date != null)
			this.paymentHistory.date = item.date;

		if (item.id != null)
			this.paymentHistory.id = item.id;

		if (item.loginId != null)
			this.paymentHistory.loginId = item.loginId;

		if (item.actions != null && item.actions != "")
			this.paymentHistory.actions = item.actions;

	}

	ngOnInit() {
	}

	/**
	 * @author Diego.Perez
	 * @date 05/07/2020
	 */
	fillPaymentHistoryList(itemsNumber: number, iteraction: number) {
		this.spinner.emit(true);
		let url: string = '/payment/getPaymentHistoryListFilter';

		let payment = {
			itemIteration: itemsNumber,
			iteration: iteraction,
			data: this.paymentHistory
		}

		this.service.post(url, payment).subscribe(
			(res) => {
				if (res.message == 'Ok') {

					res.data.forEach(pay => {
						this.paymentHistoryList.push(pay);
					});
					this.spinner.emit(false);
					this.tableSpinner = false;

				}
			},
			(err) => {
				console.log('The ERRORR ', err);
				this.spinner.emit(false);
				this.tableSpinner = false;
			}
		)
	}

	/**
	 * @param pageOfItems
	 * @author Diego.Perez
	 * @date 05/18/2020
	 */
	onPageChange(event: number) {
		let total: number = Math.ceil(this.paymentHistoryList.length / this.config.itemsPerPage);

		if (event >= total) {

			this.iteraction += this.itemsNumber;
			this.fillPaymentHistoryList(this.itemsNumber, this.iteraction);
		}
		this.config.currentPage = event;
	}

}
