import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PosGraduacaoComponent } from './posgraduacao.component';
import { PosGraduacaoRoutingModule } from './posgraduacao-routing.module';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';

@NgModule({
    imports: [CommonModule,
        FormsModule,
        PosGraduacaoRoutingModule,
        ReactiveFormsModule,
        PixRoutingModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
        TableModule,
        ToastModule,
        MessagesModule,
        MessageModule,
        AutoCompleteModule, CalendarModule,
        ChipsModule, DropdownModule, InputMaskModule,
        InputNumberModule, CascadeSelectModule,
        MultiSelectModule, InputTextareaModule,
        InputTextModule],
    declarations: [PosGraduacaoComponent]
})
export class PosGraduacaoModule { }
