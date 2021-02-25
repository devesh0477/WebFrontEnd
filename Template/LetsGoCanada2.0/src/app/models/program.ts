export class Program {
    id?: number;
    programId?: number;
    name?: string;
    typeOfProgramId?: number;
    typeOfProgramName?: string;
    schoolId?: number;
    schoolName?: string;
    duration?: number;
    processingTime?: number;
    applicationFess?: number;
    tuitionPerYear?: number;
    programsPerTerm?: {
        programPerTermId: number;
        termId: number;
        programStatus: boolean;
        isCoopRequired: boolean;
        startDate: Date;
        endDate: Date;
        submissionDate: Date;
        program: string;
        school: string;
        term: string;
        application?: string
    }
    programCost?: {

    }
    programAdmissionDetails?: {

    }

    constructor() { }

}