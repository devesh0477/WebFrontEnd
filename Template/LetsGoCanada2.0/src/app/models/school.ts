import { SchoolMedia } from "./schoolMedia";

export interface School {
    schoolId?: number,
    name?: string,
    description?: string,
    dli?: number,
    cityId?: number,
    provinceId?: number,
    countryId?: number,
    postalCode?: string,
    pobox?: number,
    hstnumber?: number,
    headquaerterAddress?: string,
    phoneNumber?: number,
    email?: string
    website?: string,
    publicInstitution?: boolean,
    about?: string,
    internationaStudents?: number,
    totalStudents?: number,
    fundationDate?: Date,
    typeInstitutionId?: number,
    keyWords?: string,

    city?: {
        cityId: number,
        provinceId: number,
        name: string,
        province: string,
        // school: []
    }
    country?: {
        countryId: number,
        name: string,
        phoneCode: number,
        // agent: [],
        // applicantCitizenship: [],
        // applicantCountry: [],
        // branch: [],
        // educationLevel: [],
        // highestEducationDetails: [],
        // province: [],
        // school: []
    }

    province?: {
        provinceId: number,
        countryId: number,
        name: string,
        country: string,
        // city: [],
        // school: []
    }

    typeInstitution?: {
        typeId?: number,
        typeName?: string,
        typeDescription?: string,
        // school?:[]
    },
    feature?: {
        hasCoop?: boolean,
        hasWork?: boolean,
        hasCondLetter?: boolean,
        hasAccomodation?: boolean,
        hasPgwp?: boolean,
    }

    finantialsSchool?: {
        schoolId?: number,
        tuitionPerYear?: number,
        costOfLiving?: number,
        applicationFees?: number,
        totalPerYear?: number,
        // school?:[]
    },

    loaConfig?: string,
    // programs: [],
    // programsPerTerm: [],

    schoolMedia?: Array<SchoolMedia>,
    /*schoolMedia?: {
        schoolMediaId?: number,
        schoolId?: number,
        mediaTypeId?: number,
        mediaName?: string,
        mediaLocation?: string,
        mediaType?: string,
        school?: string
    }*/

    // schoolPersonal: []
    logos?: SchoolMedia

}




