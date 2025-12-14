import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { AuthService } from '../demo/service/auth.service';
import { IdentidadeUsrService } from '../demo/service/identidade-usr.service';
import { PhotoService } from '../demo/service/photo.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent {
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    activeItem!: number;
    id_usuario = Number(localStorage.getItem('usuario_id'));
    fotoUrl: string = 'assets/layout/images/semusuario.png';
    constructor(public layoutService: LayoutService, public el: ElementRef, private authService: AuthService,
        private photoService: PhotoService, private identidadeService: IdentidadeUsrService) { }

    ngOnInit() {
        this.carregarFoto();
        this.carregarDados();
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onSidebarButtonClick() {
        this.layoutService.showSidebar();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    logout() {
        this.authService.logout();
    }

    carregarFoto() {
        this.photoService.getFotoUsuario(this.id_usuario).subscribe({
            next: (res) => {

                if (res?.foto_url) {

                    // URL COMPLETA ABSOLUTA + cache-buster
                    this.fotoUrl =
                        'https://tendapromos.com.br/servicoscurr/' +
                        res.foto_url +
                        '?t=' +
                        new Date().getTime();
                }
            }
        });
    }

    carregarDados() {
        if (!this.id_usuario) return;

        this.identidadeService.getUsuario(this.id_usuario).subscribe({
            next: (res) => {
                if (res?.sucesso && res?.dados) {
                }
            }
        });
    }

}
