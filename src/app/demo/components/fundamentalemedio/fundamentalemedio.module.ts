import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FundamentalMedioComponent } from './fundamentalemedio.component';
import { FundamentalMedioRoutingModule } from './fundamentalemedio-routing.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule,
        TableModule,
        ToastModule,
        MessagesModule,
        MessageModule,
        ConfirmDialogModule,
        FundamentalMedioRoutingModule, AutoCompleteModule, CalendarModule,
        ChipsModule, DropdownModule, InputMaskModule, InputNumberModule, CascadeSelectModule,
        MultiSelectModule, InputTextareaModule, InputTextModule],
    declarations: [FundamentalMedioComponent]
})
export class FundamentalMedioModule { }
