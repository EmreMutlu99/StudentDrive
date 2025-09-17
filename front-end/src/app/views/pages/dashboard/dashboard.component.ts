import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ApexOptions, NgApexchartsModule } from "ng-apexcharts";
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import { ThemeCssVariableService, ThemeCssVariablesType } from '../../../core/services/theme-css-variable.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgbDropdownModule,
    FormsModule, 
    NgbDatepickerModule, 
    NgApexchartsModule,
    FeatherIconDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  /**
   * NgbDatepicker
   */
  currentDate: NgbDateStruct = inject(NgbCalendar).getToday();

  /**
   * Apex chart
   */
  public customersChartOptions: ApexOptions | any;
  public ordersChartOptions: ApexOptions | any;
  public growthChartOptions: ApexOptions | any;
  public revenueChartOptions: ApexOptions | any;
  public monthlySalesChartOptions: ApexOptions | any;
  public cloudStorageChartOptions: ApexOptions | any;

  themeCssVariables = inject(ThemeCssVariableService).getThemeCssVariables();

  constructor() {}

  ngOnInit(): void {
    this.customersChartOptions = this.getCustomersChartOptions(this.themeCssVariables);
    this.ordersChartOptions = this.getOrdersChartOptions(this.themeCssVariables);
    this.growthChartOptions = this.getGrowthChartOptions(this.themeCssVariables);
    this.revenueChartOptions = this.getRevenueChartOptions(this.themeCssVariables);
    this.monthlySalesChartOptions = this.getMonthlySalesChartOptions(this.themeCssVariables);
    this.cloudStorageChartOptions = this.getCloudStorageChartOptions(this.themeCssVariables);
  }



  /**
   * Customerse chart options
   */
  getCustomersChartOptions(themeVariables: ThemeCssVariablesType) {
    return {
      series: [{
        name: '',
        data: [3844, 3855, 3841, 3867, 3822, 3843, 3821, 3841, 3856, 3827, 3843]
      }],
      chart: {
        type: "line",
        height: 60,
        sparkline: {
          enabled: !0
        }
      },
      colors: [themeVariables.primary],
      xaxis: {
        type: 'datetime',
        categories: ["Jan 01 2024", "Jan 02 2024", "Jan 03 2024", "Jan 04 2024", "Jan 05 2024", "Jan 06 2024", "Jan 07 2024", "Jan 08 2024", "Jan 09 2024", "Jan 10 2024", "Jan 11 2024",],
      },
      stroke: {
        width: 2,
        curve: "smooth"
      },
      markers: {
        size: 0
      },
    }
  };



  /**
   * Orders chart options
   */
  getOrdersChartOptions(themeVariables: ThemeCssVariablesType) {
    return {
      series: [{
        name: '',
        data: [36, 77, 52, 90, 74, 35, 55, 23, 47, 10, 63]
      }],
      chart: {
        type: "bar",
        height: 60,
        sparkline: {
          enabled: !0
        }
      },
      colors: [themeVariables.primary],
      plotOptions: {
        bar: {
          borderRadius: 2,
          columnWidth: "60%"
        }
      },
      xaxis: {
        type: 'datetime',
        categories: ["Jan 01 2024", "Jan 02 2024", "Jan 03 2024", "Jan 04 2024", "Jan 05 2024", "Jan 06 2024", "Jan 07 2024", "Jan 08 2024", "Jan 09 2024", "Jan 10 2024", "Jan 11 2024",],
      }
    }
  };



  /**
   * Growth chart options
   */
  getGrowthChartOptions(themeVariables: ThemeCssVariablesType) {
    return {
      series: [{
        name: '',
        data: [41, 45, 44, 46, 52, 54, 43, 74, 82, 82, 89]
      }],
      chart: {
        type: "line",
        height: 60,
        sparkline: {
          enabled: !0
        }
      },
      colors: [themeVariables.primary],
      xaxis: {
        type: 'datetime',
        categories: ["Jan 01 2024", "Jan 02 2024", "Jan 03 2024", "Jan 04 2024", "Jan 05 2024", "Jan 06 2024", "Jan 07 2024", "Jan 08 2024", "Jan 09 2024", "Jan 10 2024", "Jan 11 2024",],
      },
      stroke: {
        width: 2,
        curve: "smooth"
      },
      markers: {
        size: 0
      },
    }
  };



  /**
   * Revenue chart options
   */
  getRevenueChartOptions(themeVariables: ThemeCssVariablesType) {
    return {
      series: [{
        name: "Revenue",
        data: [
          49.3,
          48.7,
          50.6,
          53.3,
          54.7,
          53.8,
          54.6,
          56.7,
          56.9,
          56.1,
          56.5,
          60.3,
          58.7,
          61.4,
          61.1,
          58.5,
          54.7,
          52.0,
          51.0,
          47.4,
          48.5,
          48.9,
          53.5,
          50.2,
          46.2,
          48.6,
          51.7,
          51.3,
          50.2,
          54.6,
          52.4,
          53.0,
          57.0,
          52.9,
          48.7,
          52.6,
          53.5,
          58.5,
          55.1,
          58.0,
          61.3,
          57.7,
          60.2,
          61.0,
          57.7,
          56.8,
          58.9,
          62.4,
          58.7,
          58.4,
          56.7,
          52.7,
          52.3,
          50.5,
          55.4,
          50.4,
          52.4,
          48.7,
          47.4,
          43.3,
          38.9,
          34.7,
          31.0,
          32.6,
          36.8,
          35.8,
          32.7,
          33.2,
          30.8,
          28.6,
          28.4,
          27.7,
          27.7,
          25.9,
          24.3,
          21.9,
          22.0,
          23.5,
          27.3,
          30.2,
          27.2,
          29.9,
          25.1,
          23.0,
          23.7,
          23.4,
          27.9,
          23.2,
          23.9,
          19.2,
          15.1,
          15.0,
          11.0,
          9.20,
          7.47,
          11.6,
          15.7,
          13.9,
          12.5,
          13.5,
          15.0,
          13.9,
          13.2,
          18.1,
          20.6,
          21.0,
          25.3,
          25.3,
          20.9,
          18.7,
          15.3,
          14.5,
          17.9,
          15.9,
          16.3,
          14.1,
          12.1,
          14.8,
          17.2,
          17.7,
          14.0,
          18.6,
          18.4,
          22.6,
          25.0,
          28.1,
          28.0,
          24.1,
          24.2,
          28.2,
          26.2,
          29.3,
          26.0,
          23.9,
          28.8,
          25.1,
          21.7,
          23.0,
          20.7,
          29.7,
          30.2,
          32.5,
          31.4,
          33.6,
          30.0,
          34.2,
          36.9,
          35.5,
          34.7,
          36.9
        ]
      }],
      chart: {
        type: "line",
        height: '400',
        parentHeightOffset: 0,
        foreColor: themeVariables.secondary,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      colors: [themeVariables.primary, themeVariables.danger, themeVariables.warning],
      grid: {
        padding: {
          bottom: -4,
        },
        borderColor: themeVariables.gridBorder,
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      xaxis: {
        type: "datetime",
        categories: [
          "Jan 01 2024", "Jan 02 2024", "jan 03 2024", "Jan 04 2024", "Jan 05 2024", "Jan 06 2024", "Jan 07 2024", "Jan 08 2024", "Jan 09 2024", "Jan 10 2024", "Jan 11 2024", "Jan 12 2024", "Jan 13 2024", "Jan 14 2024", "Jan 15 2024", "Jan 16 2024", "Jan 17 2024", "Jan 18 2024", "Jan 19 2024", "Jan 20 2024","Jan 21 2024", "Jan 22 2024", "Jan 23 2024", "Jan 24 2024", "Jan 25 2024", "Jan 26 2024", "Jan 27 2024", "Jan 28 2024", "Jan 29 2024", "Jan 30 2024", "Jan 31 2024",
          "Feb 01 2024", "Feb 02 2024", "Feb 03 2024", "Feb 04 2024", "Feb 05 2024", "Feb 06 2024", "Feb 07 2024", "Feb 08 2024", "Feb 09 2024", "Feb 10 2024", "Feb 11 2024", "Feb 12 2024", "Feb 13 2024", "Feb 14 2024", "Feb 15 2024", "Feb 16 2024", "Feb 17 2024", "Feb 18 2024", "Feb 19 2024", "Feb 20 2024","Feb 21 2024", "Feb 22 2024", "Feb 23 2024", "Feb 24 2024", "Feb 25 2024", "Feb 26 2024", "Feb 27 2024", "Feb 28 2024",
          "Mar 01 2024", "Mar 02 2024", "Mar 03 2024", "Mar 04 2024", "Mar 05 2024", "Mar 06 2024", "Mar 07 2024", "Mar 08 2024", "Mar 09 2024", "Mar 10 2024", "Mar 11 2024", "Mar 12 2024", "Mar 13 2024", "Mar 14 2024", "Mar 15 2024", "Mar 16 2024", "Mar 17 2024", "Mar 18 2024", "Mar 19 2024", "Mar 20 2024","Mar 21 2024", "Mar 22 2024", "Mar 23 2024", "Mar 24 2024", "Mar 25 2024", "Mar 26 2024", "Mar 27 2024", "Mar 28 2024", "Mar 29 2024", "Mar 30 2024", "Mar 31 2024",
          "Apr 01 2024", "Apr 02 2024", "Apr 03 2024", "Apr 04 2024", "Apr 05 2024", "Apr 06 2024", "Apr 07 2024", "Apr 08 2024", "Apr 09 2024", "Apr 10 2024", "Apr 11 2024", "Apr 12 2024", "Apr 13 2024", "Apr 14 2024", "Apr 15 2024", "Apr 16 2024", "Apr 17 2024", "Apr 18 2024", "Apr 19 2024", "Apr 20 2024","Apr 21 2024", "Apr 22 2024", "Apr 23 2024", "Apr 24 2024", "Apr 25 2024", "Apr 26 2024", "Apr 27 2024", "Apr 28 2024", "Apr 29 2024", "Apr 30 2024",
          "May 01 2024", "May 02 2024", "May 03 2024", "May 04 2024", "May 05 2024", "May 06 2024", "May 07 2024", "May 08 2024", "May 09 2024", "May 10 2024", "May 11 2024", "May 12 2024", "May 13 2024", "May 14 2024", "May 15 2024", "May 16 2024", "May 17 2024", "May 18 2024", "May 19 2024", "May 20 2024","May 21 2024", "May 22 2024", "May 23 2024", "May 24 2024", "May 25 2024", "May 26 2024", "May 27 2024", "May 28 2024", "May 29 2024", "May 30 2024",
        ],
        lines: {
          show: true
        },
        axisBorder: {
          color: themeVariables.gridBorder,
        },
        axisTicks: {
          color: themeVariables.gridBorder,
        },
        crosshairs: {
          stroke: {
            color: themeVariables.secondary,
          },
        },
      },
      yaxis: {
        title: {
          text: 'Revenue ( $1000 x )',
          style:{
            size: 9,
            color: themeVariables.secondary
          }
        },
        tickAmount: 4,
        tooltip: {
          enabled: true
        },
        crosshairs: {
          stroke: {
            color: themeVariables.secondary,
          },
        },
        labels: {
          offsetX: 0,
        },
      },
      markers: {
        size: 0,
      },
      stroke: {
        width: 2,
        curve: "straight",
      },
    }
  };



  /**
   * Monthly sales chart options
   */
  getMonthlySalesChartOptions(themeVariables: ThemeCssVariablesType) {
    return {
      series: [{
        name: 'Sales',
        data: [152,109,93,113,126,161,188,143,102,113,116,124]
      }],
      chart: {
        type: 'bar',
        height: '330',
        parentHeightOffset: 0,
        foreColor: themeVariables.secondary,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      colors: [themeVariables.primary],  
      fill: {
        opacity: .9
      } , 
      grid: {
        padding: {
          bottom: -4
        },
        borderColor: themeVariables.gridBorder,
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      xaxis: {
        type: 'datetime',
        categories: ['01/01/2024','02/01/2024','03/01/2024','04/01/2024','05/01/2024','06/01/2024','07/01/2024', '08/01/2024','09/01/2024','10/01/2024', '11/01/2024', '12/01/2024'],
        axisBorder: {
          color: themeVariables.gridBorder,
        },
        axisTicks: {
          color: themeVariables.gridBorder,
        },
      },
      yaxis: {
        title: {
          text: 'Number of Sales',
          style:{
            size: 9,
            color: themeVariables.secondary
          }
        },
        labels: {
          offsetX: 0,
        },
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: 'center',
        fontFamily: themeVariables.fontFamily,
        itemMargin: {
          horizontal: 8,
          vertical: 0
        },
      },
      stroke: {
        width: 0
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '10px',
          fontFamily: themeVariables.fontFamily,
        },
        offsetY: -27
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          borderRadius: 4,
          dataLabels: {
            position: 'top',
            orientation: 'vertical',
          }
        },
      }
    }
  }



  /**
   * Cloud storage chart options
   */
  getCloudStorageChartOptions(themeVariables: ThemeCssVariablesType) {
    return {
      series: [67],
      chart: {
        height: 260,
        type: "radialBar"
      },
      colors: [themeVariables.primary],
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 15,
            size: "70%"
          },
          track: {
            show: true,
            background: themeVariables.gridBorder,
            strokeWidth: '100%',
            opacity: 1,
            margin: 5, 
          },
          dataLabels: {
            showOn: "always",
            name: {
              offsetY: -11,
              show: true,
              color: themeVariables.secondary,
              fontSize: "13px"
            },
            value: {
              color: themeVariables.secondary,
              fontSize: "30px",
              show: true
            }
          }
        }
      },
      fill: {
        opacity: 1
      },
      stroke: {
        lineCap: "round",
      },
      labels: ["Storage Used"]
    }
  };
  
}
