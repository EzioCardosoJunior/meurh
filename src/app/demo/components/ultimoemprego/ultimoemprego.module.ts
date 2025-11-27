import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UltimoEmpregoRoutingModule } from './ultimoemprego-routing.module';
import { UltimoEmpregoComponent } from './ultimoemprego.component';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EditorModule } from 'primeng/editor';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';

@NgModule({
    imports: [CommonModule, UltimoEmpregoRoutingModule,
        InputTextModule, ChipModule, 
        DropdownModule,
        ReactiveFormsModule,
        ToastModule,
        MessagesModule,
        MessageModule,
        ConfirmDialogModule,
        TableModule,
        FormsModule, FileUploadModule, ButtonModule, RippleModule, InputSwitchModule, EditorModule],
    declarations: [UltimoEmpregoComponent], providers: [ConfirmationService]

})
export class UltimoEmpregoModule { }
