import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmpregosAnterioresComponent } from './empregosanteriores.component';
import { EmpregosAnterioresRoutingModule } from './empregosanteriores-routing.module';
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
import { EditorModule } from 'primeng/editor';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';

@NgModule({
    imports: [CommonModule, FormsModule, EditorModule,
        ReactiveFormsModule,
        ToastModule,
        MessagesModule,
        MessageModule,
        ConfirmDialogModule,
        TableModule,
        EmpregosAnterioresRoutingModule, AutoCompleteModule, CalendarModule, ChipsModule, DropdownModule, InputMaskModule, InputNumberModule, CascadeSelectModule, MultiSelectModule, InputTextareaModule, InputTextModule],
    declarations: [EmpregosAnterioresComponent]
})
export class EmpregosAnterioresModule { }
