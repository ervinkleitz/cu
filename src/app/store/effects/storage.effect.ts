import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TableActions } from '../actions/table.actions';
import { tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

@Injectable()
export class StorageEffects {

  @Effect({ dispatch: false })
  cacheInStorage$ = this.actions$.pipe(
    ofType(TableActions.Sort, TableActions.SetSortOder),
    withLatestFrom(this.store.select('table')),
    tap(([action, store]) => {
      const columnsStr = store?.columns ? JSON.stringify(store.columns) : '';
      const sortOderStr = store?.sortOrder ? JSON.stringify(store.sortOrder) : '';

       // Cache in storage
      sessionStorage.setItem('cu_cols', columnsStr);
      sessionStorage.setItem('cu_sortOrder', sortOderStr);
    })
  );

  constructor(private actions$: Actions, private store: Store<any>) { }

}

