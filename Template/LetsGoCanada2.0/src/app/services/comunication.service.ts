import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ComunicationService {

	private _listener = new Subject<any>();
	private _listenerProcess = new Subject<any>();

	constructor() { }

	listenerProcess(): Observable<any> {
		return this._listenerProcess.asObservable();
	}

	sendProcess(params: any) {
		this._listenerProcess.next(params);
	}
}
