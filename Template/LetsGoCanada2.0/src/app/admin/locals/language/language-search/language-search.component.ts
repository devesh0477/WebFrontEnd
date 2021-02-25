import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-language-search',
  templateUrl: './language-search.component.html',
  styleUrls: ['./language-search.component.css']
})
export class LanguageSearchComponent implements OnInit {

  @Output() newSearch: EventEmitter<String> = new EventEmitter();

  searchForm = new FormGroup({
    name: new FormControl(''),
  });

  constructor() { }

  ngOnInit() {
  }

  search() {
    this.newSearch.emit(this.searchForm.get('name').value);
    console.log("Search string>>>", this.searchForm.get('name').value)
  }

  clearField() {
    this.searchForm.reset();
    // console.log(">>>>>>", this.searchForm.value);
    this.newSearch.emit("Empty");
  }

}
