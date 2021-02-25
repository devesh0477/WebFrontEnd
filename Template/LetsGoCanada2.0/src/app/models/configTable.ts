export class ConfigTable {
	url: string;
	headerRow: string[];
	columnsName: any[];
	hasEditAction: boolean;
	tableTitle: string;
	request?: string = 'get';
	objRequest?: any;

	constructor() {
		this.request = 'get';
	}
}