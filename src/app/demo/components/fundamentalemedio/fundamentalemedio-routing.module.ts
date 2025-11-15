import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FundamentalMedioComponent } from './fundamentalemedio.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: FundamentalMedioComponent }])],
    exports: [RouterModule]
})
export class FundamentalMedioRoutingModule {}
