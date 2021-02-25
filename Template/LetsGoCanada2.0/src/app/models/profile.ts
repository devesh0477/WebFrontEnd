import { Education } from "./education";
import { Language } from "./language";
import { Background } from "./background";
import { Documento } from "./documento";

export class Profile {

    public applicantId?: number;
    public tab?: string;
    public firstName?: string;
    public middleName?: string;
    public lastName?: string;
    public dateOfBirth?: Date;
    public country_citizen_code?: string;
    public citizenshipId?: string;
    public passportNumber?: string;
    public gender?: string;
    public addressLine1?: string;
    public country_code?: string;
    public countryId?: string;
    public province_code?: string;
    public province?: string;
    public city_code?: string;
    public city?: string;
    public postalCode?: string;
    public phone?: string;
    public email?: string;
    public maritaStatus?: string;
    public education_list?: Array<Education>;
    public language?: Language;
    public background?: Background;
    public documentList?: Array<Documento>;

    constructor() { }
}