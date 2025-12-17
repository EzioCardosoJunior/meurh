import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', data: { breadcrumb: 'Perfil profissional' }, loadChildren: () => import('./perfilempresarial/perfilempresarial.dashboard.module').then((m) => m.PerfilEmpresarialDashboardModule) },
            { path: 'perfil-profissional', data: { breadcrumb: 'Perfil Profissional' }, loadChildren: () => import('./perfilprofissional/perfilprofissional.module').then((m) => m.PerfilProfissionalModule) }
        ])
    ],
    exports: [RouterModule]
})
export class DashboardsRoutingModule {}
