import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GraduacaoTecnicoComponent } from './graduacaoetecnico.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: GraduacaoTecnicoComponent }])],
    exports: [RouterModule]
})
export class GraduacaoTecnicoRoutingModule {}
