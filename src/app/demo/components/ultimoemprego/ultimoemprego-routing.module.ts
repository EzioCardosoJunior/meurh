import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UltimoEmpregoComponent } from './ultimoemprego.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: UltimoEmpregoComponent }])],
    exports: [RouterModule]
})
export class UltimoEmpregoRoutingModule {}
