import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IdentidadeUsrComponent } from './identidadeusr.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: IdentidadeUsrComponent }])],
    exports: [RouterModule]
})
export class IdentidadeUsrRoutingModule {}
