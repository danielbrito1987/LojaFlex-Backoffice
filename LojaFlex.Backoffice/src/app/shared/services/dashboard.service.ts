import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardModel } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl + "Dashboard"; // Altere para o URL da sua API

  constructor(private http: HttpClient) { }

  getDashboard(): Observable<DashboardModel> {
    var url = "/GetDashboard";
    return this.http.get<DashboardModel>(this.apiUrl + url);
  }
}