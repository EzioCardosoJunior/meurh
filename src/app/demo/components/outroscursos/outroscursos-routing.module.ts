import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OutrosCursosComponent } from './outroscursos.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: OutrosCursosComponent }])],
    exports: [RouterModule]
})
export class OutrosCursosRoutingModule {}
