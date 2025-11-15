import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrigemUsrComponent } from './origemusr.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: OrigemUsrComponent }])],
    exports: [RouterModule]
})
export class OrigemUsrRoutingModule {}
