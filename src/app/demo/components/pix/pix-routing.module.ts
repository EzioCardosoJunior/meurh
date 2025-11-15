import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PixComponent } from './pix.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: PixComponent }])],
    exports: [RouterModule]
})
export class PixRoutingModule {}
