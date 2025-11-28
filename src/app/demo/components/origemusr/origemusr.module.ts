import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrigemUsrComponent } from './origemusr.component';
import { OrigemUsrRoutingModule } from './origemusr-routing.module';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';

@NgModule({
    imports: [CommonModule,
        OrigemUsrRoutingModule,
        FormsModule,
        CheckboxModule,
        DropdownModule,
        InputTextModule,
        InputNumberModule,
        ButtonModule,
        ReactiveFormsModule,
        ToastModule,
        MessagesModule,
        MessageModule,
        ConfirmDialogModule,
        TableModule,
        RippleModule],

    declarations: [OrigemUsrComponent], providers: [ConfirmationService]
})
export class OrigemUsrModule { }
