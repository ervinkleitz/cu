import { ITable } from '../models/table.interface';

export class TableState implements ITable {
  rows: [];
  columns: [];
  searchText: '';
  selectedColumns: [];
  pageNumber: 0;
  sortOrder: 'asc';
  filterObj: {};
}
