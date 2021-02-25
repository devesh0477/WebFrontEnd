import { Lang } from './../../../models/lang';
import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { MatTableDataSource, MatSelectChange } from '@angular/material';
import { showNotification } from 'src/app/toast-message/toast-message';
import { Language } from 'src/app/models/language';

declare const $: any;

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LanguageComponent implements OnInit {

  tableHeader: string[] = ['Language', 'Edit'];

  public languageList: Array<Lang>;
  public newLanguageList: Array<Lang>;
  public pageOfItems: Array<Lang>;
  public selectedLanguage;
  public table;

  constructor(private languageService: GeneralService) { }

  ngOnInit() {
    this.getLanguageList();
  }

  /**
   * @author Deivid Mafra;
   * @date 02/16/2020;
   * @param language - is a complete language object;
   * @remarks This method is responsible for allowing the end-user select a language to edit by clicking on that in the table.
   */
  selectLanguage(language: Lang) {
    this.selectedLanguage = language;
    console.log(">>>", this.selectedLanguage);
  }

  /**
   * @author Deivid Mafra;
   * @date 02/16/2020;
   * @remarks This method is responsible for loading the language list from the back-end
   */
  getLanguageList() {
    let url: string = '/admin/getLanguageList';
    this.languageService.getService(url).subscribe(
      (res) => {
        this.languageList = res.data.sort();
        // console.log("this.languageList from locals:>>>>", this.languageList)
      },
      (err) => {
        console.log(err);
      });
  }

  getFilteredLanguage(language: String) {
    if (language === "Empty") {
      this.pageOfItems = this.languageList;
    } else {
      this.pageOfItems = this.languageList.filter(languageList => languageList.name.toLowerCase() === language.toLowerCase());
    }
  }

  onChangePage(pageOfItems: Array<Lang>) {
    this.pageOfItems = pageOfItems;
  }
}
