import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';  
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    DialogModule,
    DropdownModule,
    ToastModule  
  ],
  exports: [
    ButtonModule,
    TableModule,
    TooltipModule,
    DropdownModule,
    DialogModule,
    ToastModule  
  ],
  providers: [MessageService,
    DialogService,
    ConfirmationService]  
})
export class PrimeNgModule { }
