import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnderecoUsrComponent } from './enderecousr.component';
import { EnderecoUsrRoutingModule } from './enderecousr-routing.module';
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
    imports: [CommonModule, EnderecoUsrRoutingModule,
        ReactiveFormsModule,
        ToastModule,
        MessagesModule,
        MessageModule,
        ConfirmDialogModule,
        TableModule,
        FormsModule, CheckboxModule, DropdownModule, InputTextModule, InputNumberModule, ButtonModule, RippleModule],
    declarations: [EnderecoUsrComponent], providers: [ConfirmationService]
})
export class EnderecoUsrModule { }
