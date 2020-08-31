import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';
import { TableReducer } from './store/reducers/table.reducer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchForTextPipe } from './services/pipes/search-for-text.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SearchBoxComponent } from './components/search-box/search-box.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    SearchBoxComponent,
    SearchForTextPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DragDropModule,
    StoreModule.forRoot({ table: TableReducer }),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    BrowserAnimationsModule
  ],
  providers: [SearchForTextPipe],
  bootstrap: [AppComponent],
  exports: [SearchForTextPipe]
})


export class AppModule { }
