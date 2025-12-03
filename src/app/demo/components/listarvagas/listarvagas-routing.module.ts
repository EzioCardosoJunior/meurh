import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarVagasComponent } from './listarvagas.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: ListarVagasComponent }])],
    exports: [RouterModule]
})
export class ListarVagasRoutingModule {}
