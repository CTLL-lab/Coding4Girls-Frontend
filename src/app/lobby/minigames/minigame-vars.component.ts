import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ComponentFactoryResolver,
  OnDestroy
} from '@angular/core';
import { MinigameItem } from './minigame-item';
import { MinigameVarsDirective } from './minigame-vars.directive';
import { VarsComponent } from './vars.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-minigame-vars',
  template: `
    <div>
      <ng-template minigame-vars-host></ng-template>
    </div>
  `
})
export class MinigameVarsComponent implements OnInit, OnDestroy {
  @Input() minigame: MinigameItem;
  @Input() varsForm: FormGroup;
  @ViewChild(MinigameVarsDirective) MinigameHost: MinigameVarsDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {}

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.minigame.component
    );

    const viewContainerRef = this.MinigameHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<VarsComponent>(
      componentRef.instance
    )).variables = this.minigame.data.variables;
    (<VarsComponent>componentRef.instance).form = this.varsForm;
  }
}
