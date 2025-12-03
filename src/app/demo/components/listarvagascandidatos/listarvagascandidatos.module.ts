import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarVagasCandidatosComponent } from './listarvagascandidatos.component';
import { ListarVagasCandidatosRoutingModule } from './listarvagascandidatos-routing.module';
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

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';

@NgModule({
    imports: [CommonModule, FormsModule,
        FormsModule,
        CheckboxModule,
        ButtonModule,
        ConfirmDialogModule,
        TableModule,
        ReactiveFormsModule, ToastModule, MessagesModule, MessageModule, ListarVagasCandidatosRoutingModule, AutoCompleteModule, CalendarModule, ChipsModule, DropdownModule, InputMaskModule, InputNumberModule, CascadeSelectModule, MultiSelectModule, InputTextareaModule, InputTextModule],
    declarations: [ListarVagasCandidatosComponent],
    providers: [MessageService]
})
export class ListarVagasCandidatosModule { }
