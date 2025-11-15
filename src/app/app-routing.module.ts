import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuard } from './demo/guard/auth.guard';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', loadChildren: () => import('./demo/components/dashboards/dashboards.module').then((m) => m.DashboardsModule) },
            { path: 'uikit', data: { breadcrumb: 'UI Kit' }, loadChildren: () => import('./demo/components/uikit/uikit.module').then((m) => m.UIkitModule) },
            { path: 'utilities', data: { breadcrumb: 'Utilities' }, loadChildren: () => import('./demo/components/utilities/utilities.module').then((m) => m.UtilitiesModule) },
            { path: 'pages', data: { breadcrumb: 'Pages' }, loadChildren: () => import('./demo/components/pages/pages.module').then((m) => m.PagesModule) },
            { path: 'profile', data: { breadcrumb: 'User Management' }, loadChildren: () => import('./demo/components/profile/profile.module').then((m) => m.ProfileModule) },
            { path: 'documentation', data: { breadcrumb: 'Documentation' }, loadChildren: () => import('./demo/components/documentation/documentation.module').then((m) => m.DocumentationModule) },
            { path: 'blocks', data: { breadcrumb: 'Prime Blocks' }, loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then((m) => m.PrimeBlocksModule) },
            { path: 'ecommerce', data: { breadcrumb: 'E-Commerce' }, loadChildren: () => import('./demo/components/ecommerce/ecommerce.module').then((m) => m.EcommerceModule) },
            { path: 'identidadeusr', data: { breadcrumb: 'Identificação' }, loadChildren: () => import('./demo/components/identidadeusr/identidadeusr.module').then((m) => m.IdentidadeUsrModule) },
            { path: 'enderecousr', data: { breadcrumb: 'Endereço e localização' }, loadChildren: () => import('./demo/components/enderecousr/enderecousr.module').then((m) => m.EnderecoUsrModule) },
            { path: 'origemusr', data: { breadcrumb: 'Nacionalidae e origem' }, loadChildren: () => import('./demo/components/origemusr/origemusr.module').then((m) => m.OrigemUsrModule) },
            { path: 'ultimoemprego', data: { breadcrumb: 'Último Emprego' }, loadChildren: () => import('./demo/components/ultimoemprego/ultimoemprego.module').then((m) => m.UltimoEmpregoModule) },
            { path: 'empregosanteriores', data: { breadcrumb: 'Empregos Anteriores' }, loadChildren: () => import('./demo/components/empregosanteriores/empregosanteriores.module').then((m) => m.EmpregosAnterioresModule) },
            { path: 'outrasatividades', data: { breadcrumb: 'Outras Atividades' }, loadChildren: () => import('./demo/components/outrasatividades/outrasatividades.module').then((m) => m.OutrasAtividadesModule) },
            { path: 'fundamentalemedio', data: { breadcrumb: 'Fundamental e Médio' }, loadChildren: () => import('./demo/components/fundamentalemedio/fundamentalemedio.module').then((m) => m.FundamentalMedioModule) },
            { path: 'graduacaoetecnico', data: { breadcrumb: 'Graduação e Técnico' }, loadChildren: () => import('./demo/components/graduacaoetecnico/graduacaoetecnico.module').then((m) => m.GraduacaoTecnicoModule) },
            { path: 'posgraduacao', data: { breadcrumb: 'Pós-Graduação' }, loadChildren: () => import('./demo/components/posgraduacao/posgraduacao.module').then((m) => m.PosGraduacaoModule) },
            { path: 'outroscursos', data: { breadcrumb: 'Outros Cursos' }, loadChildren: () => import('./demo/components/outroscursos/outroscursos.module').then((m) => m.OutrosCursosModule) },
            { path: 'contabancaria', data: { breadcrumb: 'Conta Bancária' }, loadChildren: () => import('./demo/components/contabancaria/contabancaria.module').then((m) => m.ContaBancariaModule) },
            { path: 'pix', data: { breadcrumb: 'Pix' }, loadChildren: () => import('./demo/components/pix/pix.module').then((m) => m.PixModule) },
            { path: 'apps', data: { breadcrumb: 'Apps' }, loadChildren: () => import('./demo/components/apps/apps.module').then((m) => m.AppsModule) }
        ]
    },
    { path: 'auth', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./demo/components/auth/auth.module').then((m) => m.AuthModule) },
    { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then((m) => m.LandingModule) },
    { path: 'notfound', loadChildren: () => import('./demo/components/notfound/notfound.module').then((m) => m.NotfoundModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
