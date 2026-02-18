import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SuggestionsRoutingModule } from './suggestions-routing.module';
import { SuggestionsComponent } from './suggestions.component';
import { ListSuggestionComponent } from './list-suggestion/list-suggestion.component';
import { SuggestionDetailsComponent } from './suggestion-details/suggestion-details.component';
import { RouterModule } from '@angular/router'; 

@NgModule({
  declarations: [
    SuggestionsComponent,
    ListSuggestionComponent,
    SuggestionDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SuggestionsRoutingModule
  ]
})
export class SuggestionsModule { }