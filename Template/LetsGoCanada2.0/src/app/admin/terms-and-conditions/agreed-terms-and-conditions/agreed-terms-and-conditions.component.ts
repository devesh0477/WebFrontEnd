import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Agency } from 'src/app/models/agency';
import { ConfigTable } from 'src/app/models/configTable';
import { TermsAndConditions } from 'src/app/models/termsAndConditions';
import { ComunicationService } from 'src/app/services/comunication.service';
import { GeneralService } from 'src/app/services/general.service';
import { showNotification } from 'src/app/toast-message/toast-message';


interface Role {
  rolId: number;
  name: string;
};

interface TermPerRole {
  rolId: number;
  rolName: string;
  titleId: number;
  titleName: string;
};

@Component({
  selector: 'app-agreed-terms-and-conditions',
  templateUrl: './agreed-terms-and-conditions.component.html',
  styleUrls: ['./agreed-terms-and-conditions.component.css']
})
export class AgreedTermsAndConditionsComponent implements OnInit {

  termPerRoleForm = new FormGroup({
    termTitle: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required)
  });

  @ViewChild('termForm') formValues;

  public configTable: ConfigTable = {
    url: '/TermsAndConditions/GetAgreedTerms',
    headerRow: ['User', 'Terms and Condition', 'Accepted Date', 'Status'],
    columnsName: ['user.email', 'termAndCondition.title', 'answerDate', 'accepted'],
    hasEditAction: true,
    request: 'get',
    tableTitle: "Agreed terms"
  };

  public termsTitles: Array<TermsAndConditions>;
  public agencies: Array<Agency>;
  public loading: boolean = false;

  constructor(private service: GeneralService, private comunication: ComunicationService) { }

  ngOnInit() {
    this.getAgencies();
  }

  getAgencies = () => {
    let url = "/Agent/getAgencies";
    this.service.getService(url).subscribe(
      res => {
        this.agencies = res.data;
      },
      err => {
        console.log(err);
      }
    )
  }

  clearForm = () => {
    this.formValues.resetForm();
  }

  saveTermPerRole = () => {
    //TODO
  }

  deleteTermPerRole = (event) => {
    //TODO
  }
}
