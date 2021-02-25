export class HeadQuarter {

    agencyId: number;
    branchId: number;
    officeName: string;
    addressLine1: string;
    addressLine2: string;
    postalCode: string;

    country: {
        countryId: number,
        name: string,
        phoneCode: number
    };

    province: string;
    city: string;
    phone: string;
    email: string;

    constructor() { }
}