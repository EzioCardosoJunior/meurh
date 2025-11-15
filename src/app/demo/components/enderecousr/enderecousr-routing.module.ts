import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnderecoUsrComponent } from './enderecousr.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: EnderecoUsrComponent }])],
    exports: [RouterModule]
})
export class EnderecoUsrRoutingModule {}
