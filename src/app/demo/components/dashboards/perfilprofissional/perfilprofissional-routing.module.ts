import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PerfilProfissionalComponent } from './perfilprofissional.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: PerfilProfissionalComponent }])],
    exports: [RouterModule]
})
export class PerfilProfissionalRoutingModule {}
