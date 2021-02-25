import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-school',
  templateUrl: './search-school.component.html',
  styleUrls: ['./search-school.component.css']
})
export class SearchSchoolComponent implements OnInit {

  @ViewChild('searchInput') searchInput: ElementRef;
  searchString: string = " ";

  @Output() newString: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  /**
   * @author Deivid Mafra;
   * @date 08/06/2019;
   * @remarks This method sends the value to setSearchString() method in search Component.
   */
  getSearchString() {
    this.searchString = this.searchInput.nativeElement.value;
    this.newString.emit(this.searchString);
    // console.log("From Search-Schools: " + this.searchString)
  }

}


