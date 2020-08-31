import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IColumn } from '../../models/column.interface';
import { Store, select } from '@ngrx/store';
import { TableLoad, TableSelectColumns, TableSetColumns, TableSort, TableResizeColumn, TableSetOrder } from '../../store/actions/table.actions';
import { ITable } from '../../models/table.interface';
import { fakeColumns } from '../../store/reducers/table.reducer';
import { DataService } from '../../services/api/data.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SearchForTextPipe } from '../../services/pipes/search-for-text.pipe';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [SearchForTextPipe]
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class TableComponent implements OnInit, OnDestroy {

  table$: ITable;
  searchText: string;
  selectedColumns: string;
  columns: IColumn[]; // component level copy of columns

  timeout: any;
  filterObj: object = {};

  pressed; // When we hold mousedown

  private unsubscribe = new Subject<void>();

  private startX;
  private endX;
  private selectedColumn: IColumn;

  constructor(
    private store: Store<{ table: ITable }>,
    private dataService: DataService,
    private searchForText: SearchForTextPipe,
    public renderer: Renderer2
  ) {
    store.pipe(
      select('table'),
      takeUntil(this.unsubscribe)
    ).subscribe(table => {
      this.table$ = table;
    });
  }

  /**
   * @desc Set "selectedColumns" to enable/disable the "Sort" button
   */
  private setSelectedColumns(): void {
    this.selectedColumns = this.table$.columns
      .filter(column => column.selected)
      .map(col => col.displayName)
      .join(', ');
  }

  /**
   * @desc Set column as "selected" and update the store
   * @param selectedColumn The column selected by the user
   */
  selectColumn(selectedColumn: IColumn): void {
    const payload = {
      ...selectedColumn,
      selected: !!selectedColumn.selected
    };
    this.store.dispatch(TableSelectColumns({ payload }));
    this.setSelectedColumns();
  }

  /**
   * @desc This is used to show the checkbox that denotes whether a column is selected
   * @param selectedColumn The column in question
   */
  isColumnSelected(selectedColumn: IColumn): boolean {
    return !!this.table$.selectedColumns.filter(selCol => selectedColumn.key === selCol.key).length;
  }

  /**
   * @desc Sort the table by the selected columns
   */
  sortColumns(): void {
    this.store.dispatch(TableSort());
  }

  /**
   * @desc Copied over from the Angular Material drag/drop doc. This method also updates
   * the state for the changes to the order of the columns.
   * @param event Mouse event
   */
  drop(event: CdkDragDrop<string[]>): void {
    if (this.pressed) { return; }
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    // Update state of the new column order
    this.store.dispatch(TableSetColumns({ payload: [...this.columns] }));
  }

  /**
   * @desc Sets the starting point for x determining the potential new column width of the selected column.
   * @param event Mouse event
   * @param column Column that is being resized
   */
  onMouseDown(event: any, column: IColumn): void {
    if (!this.pressed) {
      this.pressed = true;
      // Save x value of cursor on mousedown
      this.startX = event.x;
      // Keep track of column we are resizing
      this.selectedColumn = column;
    }
  }

  /**
   * @desc Sets the end point for x determining the potential new column width of the selected column.
   * Calculates the new widthe of the column and updates the store.
   * @param event Mouse event
   */
  onMouseUp(event: any): void {
    if (this.pressed) {
      if (this.selectedColumn) {
        // Copy the column we are modifying
        const columnWithNewWidth = { ...this.selectedColumn };
        // Save x value of cursor on mouseup
        this.endX = event.x;
        columnWithNewWidth.width = this.endX - this.startX + columnWithNewWidth.width;
        // Update state with new width
        this.store.dispatch(TableResizeColumn({ payload: columnWithNewWidth }));
      } else {
        this.selectedColumn = null;
      }
      this.pressed = false;
    }

  }

  ngOnInit(): void {

    let sessionCols: IColumn[];
    let sessionOrder: string;
    if (sessionStorage.getItem('cu_cols')) {
      sessionCols = JSON.parse(sessionStorage.getItem('cu_cols'));
    }

    if (sessionStorage.getItem('cu_sortOrder')) {
      sessionOrder = JSON.parse(sessionStorage.getItem('cu_sortOrder')) === 'asc' ? 'desc' : 'asc';
    }

    this.dataService.getData().subscribe((data: any) => {

      const initialTableState = {
        rows: data.results,
        columns: sessionCols || fakeColumns,
        searchText: '',
        selectedColumns: [],
        pageNumber: 0,
        sortOrder: sessionOrder
      } as ITable;

      this.store.dispatch(TableLoad(initialTableState));
      // Set this to enable/disable the Sort button
      this.setSelectedColumns();
      // Apply sort if we have any cached sorting data
      this.store.dispatch(TableSetOrder({ payload: sessionOrder }));
      // Now sort
      this.store.dispatch(TableSort());
    });

    this.store.pipe(
      select('table'),
      takeUntil(this.unsubscribe)
    ).subscribe((table) => {
      if (table) {
        this.columns = [...table.columns];
        this.searchText = table.searchText;
      }
    });
  }

  ngOnDestroy(): void {
    // Housekeeping
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
