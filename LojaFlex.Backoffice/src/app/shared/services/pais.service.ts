import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { PaisModel } from "../models/pais.model";

@Injectable({
    providedIn: 'root'
})
export class PaisService {
    private apiUrl = environment.apiUrl + "Pais";

    constructor(private http: HttpClient) { }

    getAll(): Observable<PaisModel[]> {
        return this.http.get<PaisModel[]>(this.apiUrl);
    }

    create(pais: PaisModel): Observable<PaisModel> {
        return this.http.post<PaisModel>(this.apiUrl, pais);
    }

    update(pais: PaisModel): Observable<PaisModel> {
        return this.http.put<PaisModel>(`${this.apiUrl}/${pais.idPais}`, pais);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'Ocorreu um erro ao tentar excluir o país.';

                if (error.status == 400) {
                    errorMessage = error.error || errorMessage;
                }

                return throwError(errorMessage);
            })
        );
    }
}