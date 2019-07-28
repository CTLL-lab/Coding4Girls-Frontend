import { Directive, HostListener, EventEmitter, Output } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';
import { takeUntil, tap, filter } from 'rxjs/operators';

@Directive({
  selector: '[appHoldable]'
})
export class HoldableDirective {
  @Output()
  holdTime: EventEmitter<number> = new EventEmitter();

  state: Subject<string> = new Subject();

  cancel: Observable<string>;

  constructor() {
    this.cancel = this.state.pipe(
      filter(v => v === 'cancel'),
      tap(v => {
        this.holdTime.emit(0);
      })
    );
  }
  @HostListener('touchend', ['$event'])
  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave', ['$event'])
  onExit() {
    this.state.next('cancel');
  }
  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onHold() {
    this.state.next('start');

    const n = 100;

    interval(n)
      .pipe(
        takeUntil(this.cancel),
        tap(v => {
          this.holdTime.emit(v * n);
        })
      )
      .subscribe();
  }
}
