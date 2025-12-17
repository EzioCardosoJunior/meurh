import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PerfilEmpresarialDashboardComponent } from './perfilempresarial.dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: PerfilEmpresarialDashboardComponent }])],
    exports: [RouterModule]
})
export class PerfilEmpresarialDashboardRoutigModule {}
