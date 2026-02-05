import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Import obligatoire pour ngModel

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { ListSuggestionComponent } from './core/list-suggestion/list-suggestion.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ListSuggestionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule  // ⚠️ IMPORTANT: Nécessaire pour utiliser [(ngModel)] dans les templates
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }