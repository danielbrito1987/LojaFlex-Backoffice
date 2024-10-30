import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { FamiliaModel } from "../models/familia.model";

@Injectable({
    providedIn: 'root'
})
export class FamiliaService {
    private apiUrl = environment.apiUrl + "Familia";

    constructor(private http: HttpClient) { }

    getAll(): Observable<FamiliaModel[]> {
        return this.http.get<FamiliaModel[]>(this.apiUrl);
    }

    create(familia: FamiliaModel): Observable<FamiliaModel> {
        return this.http.post<FamiliaModel>(this.apiUrl, familia);
    }

    update(familia: FamiliaModel): Observable<FamiliaModel> {
        return this.http.put<FamiliaModel>(`${this.apiUrl}/${familia.idFamilia}`, familia);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'Ocorreu um erro ao tentar excluir a família.';

                if (error.status == 400) {
                    errorMessage = error.error || errorMessage;
                }

                return throwError(errorMessage);
            })
        );
    }
}