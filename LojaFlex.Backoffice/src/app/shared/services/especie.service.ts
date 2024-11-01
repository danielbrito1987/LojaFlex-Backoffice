import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { EspecieModel } from "../models/especie.model";

@Injectable({
    providedIn: 'root'
})
export class EspecieService {
    private apiUrl = environment.apiUrl + "Especie";

    constructor(private http: HttpClient) { }

    getAll(): Observable<EspecieModel[]> {
        return this.http.get<EspecieModel[]>(this.apiUrl);
    }

    create(familia: EspecieModel): Observable<EspecieModel> {
        return this.http.post<EspecieModel>(this.apiUrl, familia);
    }

    update(familia: EspecieModel): Observable<EspecieModel> {
        return this.http.put<EspecieModel>(`${this.apiUrl}/${familia.idEspecie}`, familia);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'Ocorreu um erro ao tentar excluir a espécie.';

                if (error.status == 400) {
                    errorMessage = error.error || errorMessage;
                }

                return throwError(errorMessage);
            })
        );
    }
}