import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwPaginationComponent } from 'jw-angular-pagination';

@NgModule({
  declarations: [JwPaginationComponent],
  imports: [
    CommonModule
  ],
  exports: [JwPaginationComponent]
})

export class PaginationModule { }

