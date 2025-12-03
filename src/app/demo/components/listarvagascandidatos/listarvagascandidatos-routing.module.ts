import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarVagasCandidatosComponent } from './listarvagascandidatos.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: ListarVagasCandidatosComponent }])],
    exports: [RouterModule]
})
export class ListarVagasCandidatosRoutingModule {}
