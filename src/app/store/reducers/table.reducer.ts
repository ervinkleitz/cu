
import { TableActions } from '../actions/table.actions';
import { IColumn } from '../../models/column.interface';
import { TableState } from '../../state/table.state';
import { IRow } from '../../models/row.interface';

const initialTableState: TableState = {
  rows: [],
  columns: [],
  searchText: '',
  selectedColumns: [],
  pageNumber: 0,
  sortOrder: 'asc',
  filterObj: {}
};

// Ideally, we'd have some mechanism to retrieve column display names, but
// since the API does not provide a list of columns with real display names,
// I am mocking this out.
export const fakeColumns: IColumn[] = [
  {
    displayName: 'Name',
    width: 200,
    key: 'name'
  },
  {
    displayName: 'Gender',
    width: 150,
    key: 'gender'
  },
  {
    displayName: 'Skin Color',
    width: 150,
    key: 'skin_color'
  },
  {
    displayName: 'Hair Color',
    width: 150,
    key: 'hair_color'
  },
  {
    displayName: 'Birth Year',
    width: 150,
    key: 'birth_year'
  },
  {
    displayName: 'URL',
    width: 400,
    key: 'url'
  }
];

export const TableReducer = (state: TableState = initialTableState, action: any) => {
  switch (action.type) {
    case TableActions.Load:
      const { rows, columns } = action;
      return {
        ...state,
        rows,
        columns
      };
    case TableActions.Sort:
      return {
        ...state,
        sortOrder: getNewSortOrder(state),
        rows: sortByColumns(state),
      };
    case TableActions.SelectColumns:
      return {
        ...state,
        columns: getNewColumnListAfterSelecting(state, action.payload)
      };
    case TableActions.ResizeColumn:
      return {
        ...state,
        columns: newColumnsListWithResizedColumn(state, action.payload),
        selectedColumns: clearStaleColWidths(state)
      };
    case TableActions.ApplySearch:
      return {
        ...state,
        searchText: action.payload
      };
    case TableActions.SetColumns:
      return {
        ...state,
        columns: action.payload
      };
    case TableActions.SetSortOder:
      return {
        ...state,
        sortOrder: action.payload
      };
  }
};

/**
 * !!!!!!!
 * !!!!!!!
 * I would use Effects here but I am running out of time to learn it and implement it here. As such,
 * I am only using pure functions to return a computed state property
 * !!!!!!!
 * !!!!!!!
 */

/**
 * @desc Save value in session storage
 * @param key The name of the key in session
 * @param value The value to store in session
 */
function saveToSession(key, value): void {
  const session = window.sessionStorage;
  session.setItem(key, JSON.stringify(value));
}

/**
 * @desc Retrieve the new sort order after user has "Sorted" the table
 * @param state The current state of the store
 */
function getNewSortOrder(state: TableState): string {
  const newSortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
  // Cache order. Should really be an effect.
  saveToSession('cu_sortOrder', newSortOrder);
  return newSortOrder;
}

/**
 * @desc Update the widths of the column as they can go stale
 * @param state The current state of the store
 */
function clearStaleColWidths(state): IColumn[] {
  return state.selectedColumns.map((selectedCol: IColumn) => {
    const updatedCol = state.columns.filter((col: IColumn) => col.key === selectedCol.key);
    if (updatedCol.length) {
      return {
        updatedCol,
        width: updatedCol.width
      };
    }
    return selectedCol;
  });
}

/**
 * @desc Retrieve an updated list of columns including the one whose width was just resized
 * @param state The state of the store
 * @param resizedColumn The column whose width was resized
 */
function newColumnsListWithResizedColumn(state: TableState, resizedColumn: IColumn): IColumn[] {
  return state.columns.map((column: IColumn) => {
    if (column.key === resizedColumn.key) {
      return resizedColumn;
    }
    return column;
  });
}

/**
 * @desc Get the updated list of columns after user selection
 * @param state The current state of the store
 * @param selectedColumn The column that was just clicked on by the user, thereby selecting it
 */
function getNewColumnListAfterSelecting(state: TableState, selectedColumn: IColumn): IColumn[] {
  return state.columns.map((col: IColumn) => {
    if (selectedColumn.key === col.key) {
      return {
        ...selectedColumn,
        selected: !selectedColumn.selected
      };
    } else {
      return col;
    }
  });
}

/**
 * @desc Sort the rows by the selected columns
 * @param param0 Deconstructed state object containing the props we need
 */
function sortByColumns({ columns, rows, sortOrder }): IRow[] {

  let sortedRows = [];
  let columnKey;
  const selectedColumns = columns.filter((col: IColumn) => col.selected);
  if (selectedColumns.length === 1) {

    columnKey = selectedColumns[0].key;
    // Making the assumption here that we're only comparing strings.
    sortedRows = rows.slice().sort((row1, row2) => {
      const row1Val = row1[columnKey].toLowerCase();
      const row2Val = row2[columnKey].toLowerCase();
      if (sortOrder === 'desc') {
        return row1Val > row2Val ? 1 : -1;
      } else {
        return row1Val > row2Val ? -1 : 1;
      }
    });
  } else if (selectedColumns.length > 1) {

    sortedRows = rows.slice().sort((row1, row2) => {
      const keys = selectedColumns.map(col => col.key);
      let isPriorInSort;
      for (const key of keys) {
        if (sortOrder === 'desc') {
          isPriorInSort = row1[key].toLowerCase() > row2[key].toLowerCase() ? 1 : -1;
        } else {
          isPriorInSort = row1[key].toLowerCase() > row2[key].toLowerCase() ? -1 : 1;
        }
        // I don't know what the specific rules to sort multiple columns here but I am
        // breaking out when as soon as we see a value that puts row1 before row2
        if (isPriorInSort) {
          break;
        }
      }
      return isPriorInSort;
    });
  } else {
    return rows;
  }

  // Cache columns in session
  saveToSession('cu_cols', columns);

  return sortedRows;
}
