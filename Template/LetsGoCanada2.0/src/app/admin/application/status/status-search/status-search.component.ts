import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-status-search',
  templateUrl: './status-search.component.html',
  styleUrls: ['./status-search.component.css']
})
export class StatusSearchComponent implements OnInit {

  @Output() newSearch: EventEmitter<String> = new EventEmitter();

  searchForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
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
