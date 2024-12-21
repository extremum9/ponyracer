import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';
import { DecimalPipe } from '@angular/common';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, concat, EMPTY, of, switchMap } from 'rxjs';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { I18nService } from '../i18n.service';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'pr-menu',
  standalone: true,
  imports: [RouterLink, DecimalPipe, NgbCollapse, ReactiveFormsModule, TranslocoDirective],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
  public navbarCollapsed = true;
  public user: Signal<UserModel | null>;

  private i18nService = inject(I18nService);
  public availableLangs = this.i18nService.availableLangs;
  public langCtrl = inject(NonNullableFormBuilder).control(this.i18nService.lang);

  constructor(
    private _router: Router,
    private _userService: UserService
  ) {
    const user$ = toObservable(this._userService.currentUser).pipe(
      switchMap(user => (user ? concat(of(user), this._userService.scoreUpdates(user.id).pipe(catchError(() => EMPTY))) : of(null)))
    );
    this.user = toSignal(user$, { initialValue: null });

    this.langCtrl.valueChanges.pipe(takeUntilDestroyed()).subscribe(lang => this.i18nService.changeLanguage(lang));
  }

  public toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  public logout(): void {
    this._userService.logout();
    this._router.navigateByUrl('/');
  }
}
