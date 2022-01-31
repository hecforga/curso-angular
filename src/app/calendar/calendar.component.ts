import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, FullCalendarComponent } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import { DateClickArg, EventResizeDoneArg } from '@fullcalendar/interaction';
import * as moment from 'moment';

import { CalendarService } from './calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions!: CalendarOptions;

  private selectedDates: [Date, Date] | undefined;

  constructor(private calendarService: CalendarService) {
    this.calendarOptions = {
      initialView: calendarService.INITIAL_VIEW,
      locale: esLocale,
      selectable: true,
      unselectAuto: false,
      editable: true,
      eventConstraint: {
        startTime: '10:00',
        endTime: '18:00',
        daysOfWeek: [1, 2, 3, 4, 5]
      },
      dateClick: (info) => this.onDateClick(info),
      select: (info) => this.onSelect(info),
      unselect: () => this.onUnselect(),
      eventResize: (info) => this.onEventResize(info),
    };
  }

  ngOnInit(): void {
    const today = moment();
    this.calendarOptions.events = [
      { title: 'Evento 1', date: today.toDate(), start: today.toDate(), end: today.add(3, 'hours').toDate() },
      { title: 'Evento 2', date: today.add(1, 'days').toDate(), allDay: true },
    ];
  }

  ngAfterViewInit(): void {
    this.calendarService.calendarView$.subscribe(calendarView => {
      this.calendarComponent.getApi().changeView(calendarView);
    });
  }

  createEvent(): void {
    if (this.selectedDates) {
      this.calendarComponent.getApi().addEvent({ title: 'Evento nuevo', date: this.selectedDates[0], start: this.selectedDates[0], end: this.selectedDates[1] });
      this.selectedDates = undefined;
    }
  }

  isCreateButtonDisabled(): boolean {
    return this.selectedDates === undefined;
  }

  private onDateClick(info: DateClickArg): void {
    const start = moment(info.date);
    this.selectedDates = [start.toDate(), start.add(30, 'minutes').toDate()];
  }

  private onSelect(info: DateSelectArg): void {
    this.selectedDates = [info.start, info.end];
  }

  private onUnselect(): void {
    this.selectedDates = undefined;
  }

  private onEventResize(info: EventResizeDoneArg): void {
    const diff = moment(info.event.end).diff(moment(info.event.start), 'hours');
    if (diff > 5) {
      info.revert();
    }
  }
}
