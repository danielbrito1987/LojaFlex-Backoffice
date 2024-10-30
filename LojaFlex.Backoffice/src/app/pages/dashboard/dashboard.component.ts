import { Component, OnInit } from '@angular/core';
import { DashboardModel } from 'src/app/shared/models/dashboard.model';
import { DashboardService } from 'src/app/shared/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoading: boolean = false;
  dashboard: DashboardModel;

  constructor(
    private dashboardService: DashboardService,
  ) {
    this.dashboard = new DashboardModel(0, 0, 0);
  }

  ngOnInit(): void {
    this.getDashboard();
  }

  getDashboard() {
    this.isLoading = true;
    this.dashboardService.getDashboard().subscribe((data) => {
      this.dashboard = data;
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
    })
  }
}
