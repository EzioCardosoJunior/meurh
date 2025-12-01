import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CadastroVagasComponent } from './cadastrovagas.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: CadastroVagasComponent }])],
    exports: [RouterModule]
})
export class CadastroVagasRoutingModule {}
