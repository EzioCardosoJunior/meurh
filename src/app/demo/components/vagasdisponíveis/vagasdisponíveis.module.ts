import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { VagasDisponiveisComponent } from './vagasdisponiveis.component';
import { VagasDisponiveisRoutingModule } from './vagasdisponíveis-routing.module';

@NgModule({
    imports: [CommonModule, FormsModule, AvatarModule, VagasDisponiveisRoutingModule, DataViewModule, DropdownModule],
    declarations: [VagasDisponiveisComponent]
})
export class VagasDisponiveisModule {}
