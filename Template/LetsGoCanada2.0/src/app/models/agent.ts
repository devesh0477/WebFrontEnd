export class Agent {

    loginId: number;
    email: string;
    password: string;
    roleId: number;
    active: boolean;
    role: {
        rolId: number;
        name: string;
        description: string;
        active: boolean;
        roleMenu: string[]
        userLogin: string[]
    };
    agent: {
        agentId: number;
        branchId: number;
        firstName: string;
        lastName: string;
        salutation: string;
        citizenshipId: number;
        phone: number;
        passportNumber: string;
        ceo: boolean;
        keyword: string;
        agentNavigation: string;
        branch: {
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
            agency: {
                agencyId: number;
                companyName: string;
                webSite: string;
                profileComplete: boolean;
                profileApproved: boolean;
                agencyDocuments: string[];
                branch: string[];
                canadianInstitutions: string[]
            }
            country: string;
            agent: string[];
        };
        citizenship: {
            countryId: number;
            name: string;
            phoneCode: null;
            agent: string[];
            applicantCitizenship: string[];
            applicantCountry: string[];
            branch: string[];
            educationLevel: string[];
            highestEducationDetails: string[];
            lgcpersonal: string[];
            province: string[];
            school: string[]
        };
        applicant: string[]
    };
    applicant: string;
    lgcpersonal: string;
    loginStatus: string;
    notes: string[];
    securityQuestions: string[];

    constructor() { }
}