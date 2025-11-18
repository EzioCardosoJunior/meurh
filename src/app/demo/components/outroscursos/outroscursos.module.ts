import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutrosCursosComponent } from './outroscursos.component';
import { OutrosCursosRoutingModule } from './outroscursos-routing.module';
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

@NgModule({
    imports: [CommonModule,
        FormsModule,
        OutrosCursosRoutingModule,

        ReactiveFormsModule,
        PixRoutingModule,
        TableModule,
        ToastModule,
        MessagesModule,
        MessageModule,



        AutoCompleteModule,
        CalendarModule,
        ChipsModule,
        DropdownModule,
        InputMaskModule,
        InputNumberModule, CascadeSelectModule, MultiSelectModule, InputTextareaModule, InputTextModule],
    declarations: [OutrosCursosComponent]
})
export class OutrosCursosModule { }
