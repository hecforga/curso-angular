import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class CalendarService {
  INITIAL_VIEW = 'timeGridWeek';

  calendarView$!: Observable<string>;

  private calendarViewSource = new BehaviorSubject<string>(this.INITIAL_VIEW);

  constructor() {
    this.calendarView$ = this.calendarViewSource.asObservable();
  }

  setCalendarView(newCalendarView: string): void {
    this.calendarViewSource.next(newCalendarView);
  }
}
