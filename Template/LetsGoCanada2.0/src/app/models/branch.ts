export class Branch {

    branchId: number;
    agencyId: number;
    headquarters: boolean;
    officeName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    province: string;
    countryId: number;
    postalCode: string;
    phone: string;
    email: string;
    agency: string;
    country: {
        countryId: number;
        name: string;
        phoneCode: number;
        agent: string[];
        applicantCitizenship: string[];
        applicantCountry: string[];
        branch: string[];
        educationLevel: string[];
        highestEducationDetails: string[];
        lgcpersonal: string[];
        province: string[];
        school: string[];
    };
    agent: string[];


    constructor() { }
}