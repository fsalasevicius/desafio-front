import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';  
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    ToastModule  
  ],
  exports: [
    ButtonModule,
    TableModule,
    DropdownModule,
    ToastModule  
  ],
  providers: [MessageService,
    ConfirmationService]  
})
export class PrimeNgModule { }
