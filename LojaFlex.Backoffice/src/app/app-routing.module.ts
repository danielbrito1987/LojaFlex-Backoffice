import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PaisComponent } from './pages/pais/pais.component';
import { FamiliaComponent } from './pages/familia/familia.component';
import { EspecieComponent } from './pages/especie/especie.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'pais', component: PaisComponent },
  { path: 'familia', component: FamiliaComponent },
  { path: 'especie', component: EspecieComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
