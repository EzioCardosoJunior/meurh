import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatosPorVagaComponent } from './candidatosporvaga.component';
import { CandidatosPorVagaRoutingModule } from './candidatosporvaga-routing.module';
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
import { ListboxModule } from 'primeng/listbox';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
    imports: [CommonModule, 
        DialogModule,
        RadioButtonModule,
        InputTextModule,
        ButtonModule, FormsModule,
        CheckboxModule,
        ButtonModule,
        ConfirmDialogModule,
        TableModule,
        ListboxModule,
        DialogModule,
        ReactiveFormsModule, ToastModule, MessagesModule, MessageModule, CandidatosPorVagaRoutingModule, AutoCompleteModule, CalendarModule, ChipsModule, DropdownModule, InputMaskModule, InputNumberModule, CascadeSelectModule, MultiSelectModule, InputTextareaModule, InputTextModule],
    declarations: [CandidatosPorVagaComponent],
    providers: [MessageService]
})
export class CandidatosPorVagaModule { }
