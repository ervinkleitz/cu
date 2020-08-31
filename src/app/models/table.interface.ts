import { IRow } from './row.interface';
import { IColumn } from './column.interface';

export interface ITable {
  rows: IRow[];
  columns: IColumn[];
  searchText: string;
  selectedColumns: IColumn[];
  pageNumber: number;
  sortOrder: 'asc' | 'desc';
  filterObj: object;
}
