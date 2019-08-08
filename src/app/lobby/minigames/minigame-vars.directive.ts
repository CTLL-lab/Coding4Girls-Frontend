import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[minigame-vars-host]'
})
export class MinigameVarsDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
