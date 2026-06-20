import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {

  getDateTimeFormat(language: string): string {
    switch (language) {
      case 'hu':
        return 'yyyy.MM.dd HH:mm';

      case 'de':
        return 'dd.MM.yyyy HH:mm';

      case 'en':
        return 'MM.dd.yyyy HH:mm';

      default:
        return 'yyyy.MM.dd HH:mm';
    }
  }
}
