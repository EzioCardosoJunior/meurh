import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CandidatosPorVagaComponent } from './candidatosporvaga.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: CandidatosPorVagaComponent }])],
    exports: [RouterModule]
})
export class CandidatosPorVagaRoutingModule {}
