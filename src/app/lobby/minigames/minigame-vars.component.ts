import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ComponentFactoryResolver,
  OnDestroy,
  OnChanges
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
export class MinigameVarsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() minigame: MinigameItem;
  @Input() varsForm: FormGroup;
  @Input() variables: any;
  @ViewChild(MinigameVarsDirective) MinigameHost: MinigameVarsDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {}

  ngOnChanges() {
    this.loadComponent();
  }

  loadComponent() {
    if (this.minigame.component == null) {
      return;
    }
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
    if (this.minigame.data.options) {
      (<VarsComponent>componentRef.instance)[
        'options'
      ] = this.minigame.data.options;
    }
    if (this.variables) {
      (<VarsComponent>componentRef.instance)[
        'prefilled_variables'
      ] = this.variables;
    }
  }
}
