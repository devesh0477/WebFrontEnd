import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-education-search',
  templateUrl: './education-search.component.html',
  styleUrls: ['./education-search.component.css']
})
export class EducationSearchComponent implements OnInit {

  @Output() newSearch: EventEmitter<String> = new EventEmitter();

  searchForm = new FormGroup({
    levelName: new FormControl(''),
    eduTypeName: new FormControl(''),
  });

  constructor() { }

  ngOnInit() {
  }

  search() {
    this.newSearch.emit(this.searchForm.value);
    console.log("Search string>>>", this.searchForm.value)
  }

  clearField() {
    this.searchForm.reset();
    // console.log(">>>>>>", this.searchForm.value);
    this.newSearch.emit("Empty");
  }

}
