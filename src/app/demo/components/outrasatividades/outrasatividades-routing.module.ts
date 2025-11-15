import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OutrasAtividadesComponent } from './outrasatividades.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: OutrasAtividadesComponent }])],
    exports: [RouterModule]
})
export class OutrasAtividadesRoutingModule {}
