import { Component, OnInit } from '@angular/core';
// import * as Chartist from 'chartist';
import { GeneralService } from 'src/app/services/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-disciplines',
  templateUrl: './disciplines.component.html',
  styleUrls: ['./disciplines.component.css']
})
export class DisciplinesComponent implements OnInit {
  id: string;
  percentage: number[] = [];
  label: string[] = [];

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };

  pieChartData: number[] = [];
  pieChartLabels: Label[] = [];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(255, 230, 0, 0.3)', 'rgba(0,0,255,0.3)', 'rgba(255, 0, 234, 0.3)', 'rgba(0,255,0,0.3)'],
    }];

  constructor(private schoolsService: GeneralService, private route: ActivatedRoute, private newRouter: Router) { }

  ngOnInit() {
    this.getDisciplineById();
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    // console.log(event, active);
  }

  getSchoolId() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (Number(this.id)) {
      return this.id = this.route.snapshot.paramMap.get('id');
    } else
      this.newRouter.navigate(['/search'])
  }

  /**
   * @author Deivid Mafra;
   * @date 09/04/2019;
   * @remarks this method gets the info for compile a chart about the top disciplines.
   */
  getDisciplineById() {
    let url: string = '/School/getTopDisciplines/';
    this.schoolsService.getService(url + this.getSchoolId()).subscribe(
      (res) => {
        // console.log("res.data", res.data);
        for (let i = 0; i < res.data.length; i++) {
          this.pieChartData.push(Math.round(res.data[i].percentage));
          this.pieChartLabels.push(Math.round(res.data[i].percentage) + '% - ' + res.data[i].name);
        }
        // console.log("this.percentage", this.pieChartData);
        // console.log("pieChartLabels", this.pieChartLabels);
      },
      (err) => {
        console.log(err);
      });
  }
}
