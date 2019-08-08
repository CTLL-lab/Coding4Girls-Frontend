import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinigameService } from './minigame.service';
import { MinigameVarsDirective } from './minigame-vars.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionareComponent } from './questionare/questionare.component';
import { SimpleComponent } from './simple/simple.component';
import { FormElementComponent } from './form-element/form-element.component';
import { MinigameVarsComponent } from './minigame-vars.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [
    MinigameVarsDirective,
    QuestionareComponent,
    SimpleComponent,
    FormElementComponent,
    MinigameVarsComponent
  ],
  providers: [MinigameService],
  exports: [MinigameVarsComponent, SimpleComponent]
})
export class MinigamesModule {}
