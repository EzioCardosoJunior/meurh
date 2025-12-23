import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ShopeeOffersService {

    private baseUrl = '/api';

    constructor(private http: HttpClient) { }

    getOffers(scrollId?: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/shoppe.php`, {
            scrollId: scrollId ?? null
        });
    }
}
