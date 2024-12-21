import { TestBed } from '@angular/core/testing';
import { Chart } from 'chart.js';
import { Subject } from 'rxjs';
import { provideI18nTesting } from '../../i18n-test';
import { UserService } from '../user.service';
import { MoneyHistoryModel } from '../models/money-history.model';
import { MoneyHistoryComponent } from './money-history.component';

describe('MoneyHistoryComponent', () => {
  const userService = jasmine.createSpyObj<UserService>('UserService', ['getMoneyHistory']);

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideI18nTesting(), { provide: UserService, useValue: userService }]
    })
  );

  it('should display a chart', () => {
    const history$ = new Subject<Array<MoneyHistoryModel>>();
    userService.getMoneyHistory.and.returnValue(history$);
    const fixture = TestBed.createComponent(MoneyHistoryComponent);
    fixture.detectChanges();
    const history = [
      { instant: '2017-08-03T10:40:00Z', money: 10000 },
      { instant: '2017-08-04T09:15:00Z', money: 9800 }
    ] as Array<MoneyHistoryModel>;
    history$.next(history);
    fixture.detectChanges();

    expect(userService.getMoneyHistory).toHaveBeenCalled();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')!.textContent).toContain('Money history');

    const chart = Chart.getChart(element.querySelector('canvas')!);
    expect(chart).withContext('The chart should have been created in the canvas element').not.toBeUndefined();
    expect(chart!.config.data.labels)
      .withContext('The chart labels should be the instants')
      .toEqual(history.map(event => event.instant));
    expect(chart!.config.data.datasets[0].data)
      .withContext('The chart dataset should be the money')
      .toEqual(history.map(event => event.money));
  });
});
