import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PosGraduacaoComponent } from './posgraduacao.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: PosGraduacaoComponent }])],
    exports: [RouterModule]
})
export class PosGraduacaoRoutingModule {}
