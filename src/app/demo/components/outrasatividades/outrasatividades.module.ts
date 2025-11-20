import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutrasAtividadesComponent } from './outrasatividades.component';
import { OutrasAtividadesRoutingModule } from './outrasatividades-routing.module';
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
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
    imports: [CommonModule, FormsModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
        TableModule,
        ToastModule,
        MessagesModule,
        MessageModule,
        OutrasAtividadesRoutingModule, AutoCompleteModule, CalendarModule, ChipsModule, DropdownModule, InputMaskModule, InputNumberModule, CascadeSelectModule, MultiSelectModule, InputTextareaModule, InputTextModule],
    declarations: [OutrasAtividadesComponent]
})
export class OutrasAtividadesModule { }
