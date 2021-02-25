export class Language {

    public languageProficiencyId?: number;
    public applicantId?: number;
    //public mother_tongue: string;
    //public mother_toungue_code: string;
    public testName: string;
    //public acommodation: string;
    //public acommodation_code: string;
    
    public computerBased: boolean;
    public testScore: string;
    public listeningScore: string;
    public writingScore: string;
    public readingScore: string;
    public speakingScore: string;
    public testDate: Date;

    constructor() { }
}