import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContaBancariaComponent } from './contabancaria.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: ContaBancariaComponent }])],
    exports: [RouterModule]
})
export class ContaBancariaRoutingModule {}
