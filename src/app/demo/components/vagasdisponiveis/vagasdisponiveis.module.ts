import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { VagasDisponiveisComponent } from './vagasdisponiveis.component';
import { VagasDisponiveisRoutingModule } from './vagasdisponiveis-routing.module';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [CommonModule, FormsModule,
        ButtonModule,
        ReactiveFormsModule,
        ToastModule,
        MessagesModule,
        MessageModule,
        AvatarModule, VagasDisponiveisRoutingModule, DataViewModule, DropdownModule],
    declarations: [VagasDisponiveisComponent]
})
export class VagasDisponiveisModule { }
