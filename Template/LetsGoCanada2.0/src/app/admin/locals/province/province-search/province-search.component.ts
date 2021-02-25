import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Country } from 'src/app/models/country';

@Component({
  selector: 'app-province-search',
  templateUrl: './province-search.component.html',
  styleUrls: ['./province-search.component.css']
})
export class ProvinceSearchComponent implements OnInit {

  @Input() countries: Array<Country>;
  @Output() newSearch: EventEmitter<String> = new EventEmitter();

  searchForm = new FormGroup({
    countryId: new FormControl(''),
    name: new FormControl('')
  });

  constructor() { }

  ngOnInit() {
  }

  search() {
    this.newSearch.emit(this.searchForm.value);
  }

  clearField() {
    this.searchForm.reset();
    this.newSearch.emit(this.searchForm.value);
  }

}
