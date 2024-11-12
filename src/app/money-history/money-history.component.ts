import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Chart, Filler, Legend, LinearScale, LineController, LineElement, PointElement, TimeScale, Tooltip } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { UserService } from '../user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

Chart.register(LineController, LinearScale, TimeScale, PointElement, LineElement, Legend, Filler, Tooltip);

@Component({
  standalone: true,
  templateUrl: './money-history.component.html',
  styleUrl: './money-history.component.css'
})
export class MoneyHistoryComponent {
  @ViewChild('chart', { static: true })
  public canvas!: ElementRef<HTMLCanvasElement>;

  public moneyChart: Chart | null = null;

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
              scales: {
                x: {
                  type: 'time'
                }
              }
            }
          });
        });
      });
  }
}
