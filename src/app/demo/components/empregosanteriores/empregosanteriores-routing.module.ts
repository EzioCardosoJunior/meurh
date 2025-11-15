import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmpregosAnterioresComponent } from './empregosanteriores.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: EmpregosAnterioresComponent }])],
    exports: [RouterModule]
})
export class EmpregosAnterioresRoutingModule {}
