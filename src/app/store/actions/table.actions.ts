import { ITable } from '../../models/table.interface';
import { Action, createAction, props } from '@ngrx/store';
import { IColumn } from '../../models/column.interface';

export enum TableActions {
  Load = '[Table] Load',
  Sort = '[Table] Sort',
  SelectColumns = '[Table] Select Columns',
  SetColumns = '[Table] Set Columns',
  ResizeColumn = '[Table] Resize Column',
  MoveToPage = '[Table] Move To Page',
  ApplySearch = '[Table] Apply Search',
  SetSortOder = '[Table] Set Sort Oder',
}

export class ActionEx implements Action {
  readonly type: string;
  payload?: any;
}

export const TableLoad = createAction(
  TableActions.Load, props<ITable>()
);

export const TableSort = createAction(
  TableActions.Sort
);

export const TableSetColumns = createAction(
  TableActions.SetColumns, props<{ payload: IColumn[] }>()
);

export const TableSelectColumns = createAction(
  TableActions.SelectColumns, props<{ payload: IColumn }>()
);

export const TableResizeColumn = createAction(
  TableActions.ResizeColumn, props<{ payload: IColumn }>()
);

export const TableApplySearch = createAction(
  TableActions.ApplySearch, props<{ payload: string }>()
);

export const TableSetOrder = createAction(
  TableActions.SetSortOder, props<{ payload: string }>()
);
