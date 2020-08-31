import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ITable } from '../../models/table.interface';
import { TableApplySearch } from '../../store/actions/table.actions';


@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  selectedColumns$: string;

  private timeout;

  constructor(private store: Store<{ table: ITable }>) {
  }

  /**
   * @desc Uses the search text to filter the rows in the table. Applies
   * a crude debounce to improve efficiency.
   * @param event Keyboard event
   */
  applySearchText(event: any): void {
    // A simple debounce so we don't keep re-rendering the table after every keyup
    if (this.timeout) {
      clearInterval(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.store.dispatch(TableApplySearch({ payload: event.target.value }));
    }, 500);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    clearInterval(this.timeout);
  }

}
