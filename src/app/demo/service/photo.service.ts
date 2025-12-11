import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Image } from 'src/app/demo/api/image';

@Injectable({
    providedIn: 'root'
})
export class PhotoService {
    constructor(private http: HttpClient) { }

     private baseUrl = '/api';

    getImages() {
        return this.http
            .get<any>('assets/demo/data/photos.json')
            .toPromise()
            .then((res) => res.data as Image[])
            .then((data) => data);
    }

    getFotoUsuario(id_usuario: number): Observable<any> {
        return this.http.get<any>(
            `${this.baseUrl}/get_foto_usuario.php?id_usuario=${id_usuario}`
        );
    }

    /**
     * FAZ UPLOAD DA FOTO DO USUÁRIO
     * POST → upload_foto_usuario.php
     * multipart/form-data
     */
    uploadFotoUsuario(id_usuario: number, arquivo: File): Observable<any> {

        const formData = new FormData();
        formData.append('id_usuario', String(id_usuario));
        formData.append('foto', arquivo);

        return this.http.post<any>(
            `${this.baseUrl}/upload_foto_usuario.php`,
            formData
        );
    }
}
