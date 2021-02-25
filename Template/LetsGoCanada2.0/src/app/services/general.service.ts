import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class GeneralService {

	public url: string;
	public error: any;
	public rpt;

	constructor(public http?: HttpClient) {
		this.url = GLOBAL.url;

		if (localStorage.getItem('session') != null) {
		}
	}

	/**
	 * @param url 
	 * @param params
	 * @author Diego.Perez
	 * @date 11/18/2019 
	 */
	noAuthenticationPost(url: string, params: any) {

		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json', //'application/x-www-form-urlencoded; application/json; charset=utf-8'
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
			})
		};

		return this.http.post<any>(this.url + url, JSON.stringify(params), httpOptions);
	}

	/**
	 * General method that perform the post call request.
	 * @param url part of the url to call the API restful.
	 * @param params variables that the API needs to do the task.
	 * @author Diego.Perez
	 * @date 05/06/2019.
	 */
	post(url: string, params: any): Observable<any> {

		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json', //'application/x-www-form-urlencoded; application/json; charset=utf-8'
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
				'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('session')).token
			})
		};

		return this.http.post<any>(this.url + url, JSON.stringify(params), httpOptions);
	}

	postWithoutAuth(url: string, params: any): Observable<any> {

		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json', //'application/x-www-form-urlencoded; application/json; charset=utf-8'
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
			})
		};

		return this.http.post<any>(this.url + url, JSON.stringify(params), httpOptions);
	}

	/**
	 * @param url 
	 * @param params 
	 */
	authentication(url: string, params: any) {

		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json', //'application/x-www-form-urlencoded; application/json; charset=utf-8'
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
			})
		};

		return this.http.post<any>(this.url + url, JSON.stringify(params), httpOptions);
	}

	getCountry(url: string, params: any) {
		//Insert in appConfigsFile
		var apiCountryKey = '8278cf8a672cf45e53864ac1570034a6';
		url = 'https://api.ipstack.com/check?access_key=' + apiCountryKey
		return this.http.get(url);
	}

	/**
	 * Method to allow the user to download the document pdf type.
	 * @param url 
	 * @param params 
	 * @author Diego.Perez.
	 * @date 07/30/2019.
	 */
	downloadFile(url: string, params: any) {

		let options = new HttpHeaders();
		// options.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('session')).token);

		return this.http.post(this.url + url, params, { headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('session')).token }, observe: 'response', responseType: 'blob' });
	}

	/**
	 * Methos to call the external API and uses parameters.
	 * @param url the address to access the functionality.
	 * @param params parameters that the API needs to function correctly. 
	 * @author Diego.Perez.
	 * @date 07/27/2019.
	 */
	getServiceParams(url: string, search: any) {
		let headers = new HttpHeaders();
		headers.append('Content-Type', 'application/json');

		return this.http.get(this.url + url, {
			headers: headers,
			params: search
			//observe: search Merge
		});
	}

	deleteFile(url: string, params) {

		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json', //'application/x-www-form-urlencoded; application/json; charset=utf-8'
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
				'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('session')).token
			})
		};

		return this.http.post<any>(this.url + url, params, httpOptions);
	}

	/**
	 * @param url 
	 * @param file 
	 */
	postFile(url: string, file) {

		let httpOptions = {
			headers: new HttpHeaders({
				//'Content-Type': 'multipart/form-data', //'application/x-www-form-urlencoded; application/json; charset=utf-8'
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
				'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('session')).token
			})
		};

		return this.http.post<any>(this.url + url, file, httpOptions);
	}

	/**
	 * @param url part of the url that perform the get call request.
	 * @author Diego.Perez.
	 * @date 05/06/2019.
	 */
	getService(url: string) {

		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json', //'application/x-www-form-urlencoded; application/json; charset=utf-8'
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
				'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('session')).token
			})
		};

		return this.http.get<any>(this.url + url, httpOptions);
	}

/**
	 * @param url part of the url that perform the get call request.
	 * @author Diego.Perez.
	 * @date 05/06/2019.
	 */
	getServiceAnonimus(url: string) {

		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json', //'application/x-www-form-urlencoded; application/json; charset=utf-8'
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
			})
		};

		return this.http.get<any>(this.url + url, httpOptions);
	}


	/**
	 * This service is to allow the app to get information from other apis.
	 * @param url 
	 * @author Diego.Perez.
	 */
	getExternalService(url: string) {
		let url2: string = 'http://localhost/backend-apirest/index.php';
		return this.http.get<any>(url2 + url);
	}

	deleteService(url: string) {

		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json', //'application/x-www-form-urlencoded; application/json; charset=utf-8'
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
			})
		};

		if (httpOptions.headers.get('Authorization') == null && localStorage.getItem('session') != null)
			httpOptions.headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('session')).token);

		return this.http.delete<any>(url, httpOptions);
	}

	delete(url: string, body?: any) {

		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
				'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('session')).token
			}),
			body
		};

		return this.http.delete<any>(this.url + url, httpOptions);
	}

	getDownloadCsv(url: string) {

		let httpOptions = {
			headers: new HttpHeaders({
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Content-Disposition',
				// 'Access-Control-Expose-Headers': 'Content-Disposition',
				'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('session')).token
			}),
			// 'observe': 'response' as 'body', // trying to get the file name
			'responseType': 'blob' as 'json'
		};
		return this.http.get<any>(this.url + url, httpOptions)
	}
}
