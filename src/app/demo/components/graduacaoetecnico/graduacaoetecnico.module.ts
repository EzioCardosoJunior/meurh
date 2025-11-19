import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraduacaoTecnicoComponent } from './graduacaoetecnico.component';
import { GraduacaoTecnicoRoutingModule } from './graduacaoetecnico-routing.module';
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
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { PixRoutingModule } from '../pix/pix-routing.module';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
    imports: [CommonModule,
        FormsModule,
        GraduacaoTecnicoRoutingModule,
        ReactiveFormsModule,
        PixRoutingModule,
        TableModule,
        ToastModule,
        MessagesModule,
        MessageModule,
        ConfirmDialogModule,
        AutoCompleteModule,
        CalendarModule,
        ChipsModule, DropdownModule,
        InputMaskModule, InputNumberModule,
        CascadeSelectModule,
        MultiSelectModule,
        InputTextareaModule,
        InputTextModule],
    declarations: [GraduacaoTecnicoComponent]
})
export class GraduacaoTecnicoModule { }
