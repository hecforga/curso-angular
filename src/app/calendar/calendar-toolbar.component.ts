import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CalendarService } from './calendar.service';

@Component({
  selector: 'app-calendar-toolbar',
  templateUrl: './calendar-toolbar.component.html',
})
export class CalendarToolbarComponent {
  @Input() createEventDisabled!: boolean;

  @Output() createEventClicked = new EventEmitter();

  calendarViewOptions = ['dayGridMonth', 'timeGridWeek', 'listWeek', 'dayGridWeek'];

  constructor(private calendarService: CalendarService) { }

  onCreateEventButtonClick(): void {
    this.createEventClicked.emit();
  }

  getCalendarView(): Observable<string> {
    return this.calendarService.calendarView$;
  }

  onCalendarViewChange(calendarView: string) {
    this.calendarService.setCalendarView(calendarView);
  }
}
