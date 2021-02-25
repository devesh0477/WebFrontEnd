import { Feature } from "./feature";
import { FinantialsSchool } from "./finantialsSchool";
import { SchoolMedia } from "./schoolMedia";

export class Schoolm {

    public schoolId?: number;
    public name?: string;
    public description?: string;
    public dli?: string;
    public cityId?: number;
    public city;
    public provinceId?: number;
    public countryId?: number;
    public postalCode?: string;
    public pobox?: string;
    public hstnumber?: number;
    public headquaerterAddress?: string;
    public phoneNumber?: string;
    public email?: string;
    public website?: string;
    public publicInstitution?: boolean;
    public about?: string;
    public internationaStudents?: string;
    public totalStudents?: number;
    public fundationDate?: Date;
    public typeInstitutionId?: number;
    public keyWords?: string;
    public typeInstitution;
    public feature?: Feature;
    public finantialsSchool?: FinantialsSchool;
    public schoolMedia?: Array<SchoolMedia>;

    constructor() { }

}