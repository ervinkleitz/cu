import { Pipe, PipeTransform } from '@angular/core';
import { IRow } from '../../models/row.interface';

@Pipe({
  name: 'searchForText'
})
export class SearchForTextPipe implements PipeTransform {

  transform(items: IRow[], filter: string): any[] {

    if (!items || !filter) {
      return items;
    }
    // Simple filter
    const newItems = items.filter(row => {
      return JSON.stringify(row).toLowerCase().indexOf(filter.toLowerCase()) > -1;
    });
    return newItems;
  }

}
