import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VagasDisponiveisComponent } from './vagasdisponiveis.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: VagasDisponiveisComponent }])],
    exports: [RouterModule]
})
export class VagasDisponiveisRoutingModule {}
