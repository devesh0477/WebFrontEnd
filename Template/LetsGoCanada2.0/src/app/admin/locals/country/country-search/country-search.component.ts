import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-country-search',
  templateUrl: './country-search.component.html',
  styleUrls: ['./country-search.component.css']
})
export class CountrySearchComponent implements OnInit {

  @Output() newSearch: EventEmitter<String> = new EventEmitter();

  public whosWorking: string = '';

  searchForm = new FormGroup({
    name: new FormControl(''),
  });

  constructor() { }

  ngOnInit() {
  }

  search() {
    this.newSearch.emit(this.searchForm.get('name').value);
  }

  clearField() {
    this.searchForm.reset();
    this.newSearch.emit("");
  }

}
