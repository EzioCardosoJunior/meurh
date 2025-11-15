import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnderecoUsrComponent } from './enderecousr.component';
import { EnderecoUsrRoutingModule } from './enderecousr-routing.module';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    imports: [CommonModule, EnderecoUsrRoutingModule, FormsModule, CheckboxModule, DropdownModule, InputTextModule, InputNumberModule, ButtonModule, RippleModule],
    declarations: [EnderecoUsrComponent]
})
export class EnderecoUsrModule {}
