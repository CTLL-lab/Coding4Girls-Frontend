import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [NavbarComponent, HomeComponent],
  imports: [CommonModule, FormsModule, RouterModule, SharedModule],
  exports: [NavbarComponent, HomeComponent]
})
export class CoreModule {}
