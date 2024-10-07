import { booleanAttribute, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pr-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  @Input()
  public type: 'success' | 'danger' | 'warning' = 'warning';

  @Input({ transform: booleanAttribute })
  public dismissible = true;

  @Output()
  public readonly closed = new EventEmitter<void>();

  public get alertClasses(): string {
    return `alert ${this.dismissible ? 'alert-dismissible' : ''} alert-${this.type}`;
  }

  public closeHandler(): void {
    this.closed.emit();
  }
}
