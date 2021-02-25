export class ApplicationSearch {

    public statusId?: string[];
    public schoolId?: string[];
    public programId?: string[];
    public applicationId?: number;
    public applicantName?: string;
    public intakeId?: string[];
    public agentID?: number[];
    public branchID?: number[];
    public agencyID?: number[];

    public ApplicationSearch() {
        this.statusId = [];
        this.schoolId = [];
        this.programId = [];
        this.applicationId = 0;
        this.applicantName = "";
        this.intakeId = [];
        this.agentID = [];
        this.branchID = [];
        this.agencyID = [];
    }

    constructor() { }
}