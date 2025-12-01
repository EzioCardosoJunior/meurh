import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroVagasComponent } from './cadastrovagas.component';
import { CadastroVagasRoutingModule } from './cadastrovagas-routing.module';
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

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastModule, MessagesModule, MessageModule, CadastroVagasRoutingModule, AutoCompleteModule, CalendarModule, ChipsModule, DropdownModule, InputMaskModule, InputNumberModule, CascadeSelectModule, MultiSelectModule, InputTextareaModule, InputTextModule],
    declarations: [CadastroVagasComponent],
    providers: [MessageService]
})
export class CadastroVagasModule { }
