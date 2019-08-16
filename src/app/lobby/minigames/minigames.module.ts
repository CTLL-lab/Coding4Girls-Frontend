import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinigameService } from './minigame.service';
import { MinigameVarsDirective } from './minigame-vars.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionareComponent } from './questionare/questionare.component';
import { SimpleComponent } from './simple/simple.component';
import { FormElementComponent } from './form-element/form-element.component';
import { MinigameVarsComponent } from './minigame-vars.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UploaderService } from 'src/app/shared/services/uploader/uploader.service';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  declarations: [
    MinigameVarsDirective,
    QuestionareComponent,
    SimpleComponent,
    FormElementComponent,
    MinigameVarsComponent
  ],
  providers: [MinigameService, UploaderService],
  exports: [MinigameVarsComponent, SimpleComponent]
})
export class MinigamesModule {}
