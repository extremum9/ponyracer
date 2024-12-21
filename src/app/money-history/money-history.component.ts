import { Component, ElementRef, inject, LOCALE_ID, NgZone, ViewChild } from '@angular/core';
import { Chart, Filler, Legend, LinearScale, LineController, LineElement, PointElement, TimeScale, Tooltip } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { UserService } from '../user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Locale } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { TranslocoDirective } from '@jsverse/transloco';

Chart.register(LineController, LinearScale, TimeScale, PointElement, LineElement, Legend, Filler, Tooltip);

const locales: Record<string, Locale> = {
  en: enUS,
  fr: fr
};

@Component({
  standalone: true,
  templateUrl: './money-history.component.html',
  imports: [TranslocoDirective],
  styleUrl: './money-history.component.css'
})
export class MoneyHistoryComponent {
  @ViewChild('chart')
  public canvas!: ElementRef<HTMLCanvasElement>;

  public moneyChart: Chart | null = null;

  private _locale = inject(LOCALE_ID);

  constructor(
    private readonly _zone: NgZone,
    private readonly _userService: UserService
  ) {
    this._userService
      .getMoneyHistory()
      .pipe(takeUntilDestroyed())
      .subscribe(history => {
        this._zone.runOutsideAngular(() => {
          const canvas = this.canvas.nativeElement;
          this.moneyChart = new Chart(canvas, {
            type: 'line',
            data: {
              labels: history.map(event => event.instant),
              datasets: [
                {
                  label: 'Money history',
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  fill: 'origin',
                  tension: 0.5,
                  data: history.map(event => event.money)
                }
              ]
            },
            options: {
              locale: this._locale,
              scales: {
                x: {
                  type: 'time',
                  adapters: {
                    date: {
                      locale: locales[this._locale]
                    }
                  }
                }
              }
            }
          });
        });
      });
  }
}
