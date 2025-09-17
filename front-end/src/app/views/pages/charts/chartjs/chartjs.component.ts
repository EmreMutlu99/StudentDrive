import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ThemeCssVariableService } from '../../../../core/services/theme-css-variable.service';

@Component({
  selector: 'app-chartjs',
  standalone: true,
  imports: [
    RouterLink,
    BaseChartDirective
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ],
  templateUrl: './chartjs.component.html'
})
export class ChartjsComponent {

  private themeCssVariableService = inject(ThemeCssVariableService);
  themeCssVariables = this.themeCssVariableService.getThemeCssVariables();


  /**
   * Bar chart
   */
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: this.themeCssVariables.gridBorder,
        },
        ticks: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          display: true,
          color: this.themeCssVariables.gridBorder,
        },
        ticks: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 12
          }
        }
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [];
  public barChartData: ChartData<'bar'> = {
    labels: [ "China", "America", "India", "Germany", "Oman"],
    datasets: [
      { 
        label: "Population",
        backgroundColor: [this.themeCssVariables.primary, this.themeCssVariables.danger, this.themeCssVariables.warning, this.themeCssVariables.success, this.themeCssVariables.info],
        hoverBackgroundColor: [this.themeCssVariables.primary, this.themeCssVariables.danger, this.themeCssVariables.warning, this.themeCssVariables.success, this.themeCssVariables.info],
        borderColor: [this.themeCssVariables.primary, this.themeCssVariables.danger, this.themeCssVariables.warning, this.themeCssVariables.success, this.themeCssVariables.info],
        hoverBorderColor: [this.themeCssVariables.primary, this.themeCssVariables.danger, this.themeCssVariables.warning, this.themeCssVariables.success, this.themeCssVariables.info],
        data: [2478,5267,734,2084,1433],
      }
    ],
  };



  /**
   * Line chart
   */
  public lineChartData: ChartConfiguration['data'] = {
    labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
    datasets: [{ 
        data: [86,114,106,106,107,111,133,221,783,2478],
        label: "Africa",
        borderColor: this.themeCssVariables.info,
        backgroundColor: "transparent",
        fill: true,
        pointBackgroundColor: this.themeCssVariables.light,
        pointHoverBackgroundColor: this.themeCssVariables.light,
        pointBorderColor: this.themeCssVariables.info,
        pointHoverBorderColor: this.themeCssVariables.info,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
        tension: .3
      }, { 
        data: [282,350,411,502,635,809,947,1402,3700,5267],
        label: "Asia",
        borderColor: this.themeCssVariables.danger,
        backgroundColor: "transparent",
        fill: true,
        pointBackgroundColor: this.themeCssVariables.light,
        pointHoverBackgroundColor: this.themeCssVariables.light,
        pointBorderColor: this.themeCssVariables.danger,
        pointHoverBorderColor: this.themeCssVariables.danger,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
        tension: .3
      }
    ]
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { 
        display: true,
        labels: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 13,
            family: this.themeCssVariables.fontFamily
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: this.themeCssVariables.gridBorder,
        },
        ticks: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          display: true,
          color: this.themeCssVariables.gridBorder,
        },
        ticks: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 12
          }
        }
      }
    }
  };
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];



  /**
   * Doughnut chart
   */
  public doughnutChartOptions: ChartConfiguration['options'] = {
    aspectRatio: 2,
    plugins: {
      legend: { 
        display: true,
        labels: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 13,
            family: this.themeCssVariables.fontFamily
          }
        }
      },
    }
  };
  public doughnutChartLabels: string[] = ["Africa", "Asia", "Europe"];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        label: "Population (millions)",
        backgroundColor: [this.themeCssVariables.primary, this.themeCssVariables.danger, this.themeCssVariables.info],
        hoverBackgroundColor: [this.themeCssVariables.primary, this.themeCssVariables.danger, this.themeCssVariables.info],
        borderColor: this.themeCssVariables.light,
        hoverBorderColor: [this.themeCssVariables.primary, this.themeCssVariables.danger, this.themeCssVariables.info],
        data: [2478,4267,1334],
      }
    ]
  };
  public doughnutChartType: ChartType = 'doughnut';



  /**
   * Area chart
   */
  public areaChartData: ChartConfiguration['data'] = {
    labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
    datasets: [{ 
        data: [86,114,106,106,107,111,133,221,783,2478],
        label: "Africa",
        borderColor: this.themeCssVariables.danger,
        backgroundColor: 'rgba(255,51,102,.3)',
        fill: true,
        pointBackgroundColor: this.themeCssVariables.light,
        pointHoverBackgroundColor: this.themeCssVariables.light,
        pointBorderColor: this.themeCssVariables.danger,
        pointHoverBorderColor: this.themeCssVariables.danger,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
        tension: .3
      }, { 
        data: [282,350,411,502,635,809,947,1402,3700,5267],
        label: "Asia",
        borderColor: this.themeCssVariables.info,
        backgroundColor: 'rgba(102,209,209,.3)',
        fill: true,
        pointBackgroundColor: this.themeCssVariables.light,
        pointHoverBackgroundColor: this.themeCssVariables.light,
        pointBorderColor: this.themeCssVariables.info,
        pointHoverBorderColor: this.themeCssVariables.info,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
        tension: .3
      }
    ]
  };
  public areaChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { 
        display: true,
        labels: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 13,
            family: this.themeCssVariables.fontFamily
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: this.themeCssVariables.gridBorder,
        },
        ticks: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          display: true,
          color: this.themeCssVariables.gridBorder,
        },
        ticks: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 12
          }
        }
      }
    }
  };
  public areaChartType: ChartType = 'line';
  public areaChartPlugins = [];



  /**
   * Pie chart
   */
  public pieChartOptions: ChartConfiguration['options'] = {
    aspectRatio: 2,
    plugins: {
      legend: { 
        display: true,
        labels: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 13,
            family: this.themeCssVariables.fontFamily
          }
        }
      },
    },
  };
   public pieChartLabels: string[] = ["Africa", "Asia", "Europe"];
   public pieChartData: ChartData<'doughnut'> = {
     labels: this.pieChartLabels,
     datasets: [{
      label: "Population (millions)",
      backgroundColor: [this.themeCssVariables.primary, this.themeCssVariables.danger, this.themeCssVariables.info],
      hoverBackgroundColor: [this.themeCssVariables.primary, this.themeCssVariables.danger, this.themeCssVariables.info],
      borderColor: this.themeCssVariables.light,
      hoverBorderColor: [this.themeCssVariables.primary, this.themeCssVariables.danger, this.themeCssVariables.info],
      data: [2478,4267,1334]
     }]
   };
   public pieChartType: ChartType = 'pie';



  /**
   * Bubble chart
   */
   public bubbleChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { 
        display: true,
        labels: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 13,
            family: this.themeCssVariables.fontFamily
          }
        }
      },
    },
    scales: {
      x: { 
        display: true,
        title: {
          display: true,
          text: "GDP (PPP)",
          color: this.themeCssVariables.secondary,
          font: {
            family: this.themeCssVariables.fontFamily
          }
        },
        grid: {
          display: true,
          color: this.themeCssVariables.gridBorder,
        },
        ticks: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 12
          }
        }
      },
      y: { 
        display: true,
        title: {
          display: true,
          text: "Happiness",
          color: this.themeCssVariables.secondary,
          font: {
            family: this.themeCssVariables.fontFamily
          }
        },
        grid: {
          display: true,
          color: this.themeCssVariables.gridBorder,
        },
        ticks: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 12
          }
        }
      },
    }
  };
  public bubbleChartType: ChartType = 'bubble';
  public bubbleChartLegend = true;
  public bubbleChartData: ChartData<'bubble'> = {
    labels: [],
    datasets: [
      {
        label: "China",
        backgroundColor: 'rgba(102,209,209,.3)',
        hoverBackgroundColor: 'rgba(102,209,209,.3)',
        borderColor: this.themeCssVariables.info,
        hoverBorderColor: this.themeCssVariables.info,
        data: [{
          x: 21269017,
          y: 5.245,
          r: 15
        }]
      }, {
        label: "Denmark",
        backgroundColor: "rgba(255,51,102,.3)",
        hoverBackgroundColor: "rgba(255,51,102,.3)",
        borderColor: this.themeCssVariables.danger,
        hoverBorderColor: this.themeCssVariables.danger,
        data: [{
          x: 258702,
          y: 7.526,
          r: 10
        }]
      }, {
        label: "Germany",
        backgroundColor: "rgba(101,113,255,.3)",
        hoverBackgroundColor: "rgba(101,113,255,.3)",
        borderColor: this.themeCssVariables.primary,
        hoverBorderColor: this.themeCssVariables.primary,
        data: [{
          x: 3979083,
          y: 6.994,
          r: 15
        }]
      }, {
        label: "Japan",
        backgroundColor: "rgba(251,188,6,.3)",
        hoverBackgroundColor: "rgba(251,188,6,.3)",
        borderColor: this.themeCssVariables.warning,
        hoverBorderColor: this.themeCssVariables.warning,
        data: [{
          x: 4931877,
          y: 5.921,
          r: 15
        }]
      }
    ]
  };



  /**
   * Radar chart
   */
  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    aspectRatio: 2,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: this.themeCssVariables.gridBorder,
        },
        grid: {
          color: this.themeCssVariables.gridBorder
        },
        suggestedMin: 0,
        suggestedMax: 60,
        ticks: {
          backdropColor: this.themeCssVariables.light,
          color: this.themeCssVariables.secondary,
          font: {
            size: 11,
            family: this.themeCssVariables.fontFamily
          }
        },
        pointLabels: {
          color: this.themeCssVariables.secondary,
          font: {
            family: this.themeCssVariables.fontFamily,
            size: 13
          }
        }
      }
    },
    plugins: {
      legend: { 
        display: true,
        labels: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 13,
            family: this.themeCssVariables.fontFamily
          }
        }
      },
    },
  };
  public radarChartLabels: string[] = ["Africa", "Asia", "Europe", "Latin America", "North America"];
  public radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [
      {
        label: "1950",
        fill: true,
        backgroundColor: "rgba(255,51,102,.3)",
        borderColor: this.themeCssVariables.danger,
        pointBorderColor: this.themeCssVariables.danger,
        pointHoverBorderColor: this.themeCssVariables.danger,
        pointBackgroundColor: this.themeCssVariables.light,
        pointHoverBackgroundColor: this.themeCssVariables.light,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
        data: [8.77,55.61,21.69,6.62,6.82]
      }, {
        label: "2050",
        fill: true,
        backgroundColor: "rgba(102,209,209,.3)",
        borderColor: this.themeCssVariables.info,
        pointBorderColor: this.themeCssVariables.info,
        pointHoverBorderColor: this.themeCssVariables.info,
        pointBackgroundColor: this.themeCssVariables.light,
        pointHoverBackgroundColor: this.themeCssVariables.light,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
        data: [25.48,54.16,7.61,8.06,4.45]
      }
    ]
  };
  public radarChartType: ChartType = 'radar';



  /**
   * Polar area chart
   */
  public polarChartOptions: ChartConfiguration['options'] = {
    aspectRatio: 2,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: this.themeCssVariables.gridBorder,
        },
        grid: {
          color: this.themeCssVariables.gridBorder
        },
        suggestedMin: 1000,
        suggestedMax: 5500,
        ticks: {
          backdropColor: this.themeCssVariables.light,
          color: this.themeCssVariables.secondary,
          font: {
            size: 11,
            family: this.themeCssVariables.fontFamily
          }
        },
        pointLabels: {
          color: this.themeCssVariables.secondary,
          font: {
            family: this.themeCssVariables.fontFamily,
            size: 13
          }
        }
      }
    },
    plugins: {
      legend: { 
        display: true,
        labels: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 13,
            family: this.themeCssVariables.fontFamily
          }
        }
      },
    },
  };
  public polarAreaChartLabels: string[] = ["Africa", "Asia", "Europe", "Latin America"];
  public polarAreaChartData: ChartData<'polarArea'> = {
    labels: this.polarAreaChartLabels,
    datasets: [
      {
        label: "Population (millions)",
        backgroundColor: [this.themeCssVariables.primary, this.themeCssVariables.danger, this.themeCssVariables.success, this.themeCssVariables.info],
        hoverBackgroundColor: [this.themeCssVariables.primary, this.themeCssVariables.danger, this.themeCssVariables.success, this.themeCssVariables.info],
        borderColor: this.themeCssVariables.light,
        hoverBorderColor: [this.themeCssVariables.primary, this.themeCssVariables.danger, this.themeCssVariables.success, this.themeCssVariables.info],
        data: [3578,5000,1034,2034]
      }
    ]
  };
  public polarAreaLegend = true;
  public polarAreaChartType: ChartType = 'polarArea';



  /**
   * Grouped bar chart
   */
  public groupedBarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { 
        display: true,
        labels: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 13,
            family: this.themeCssVariables.fontFamily
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: this.themeCssVariables.gridBorder,
        },
        ticks: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          display: true,
          color: this.themeCssVariables.gridBorder,
        },
        ticks: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 12
          }
        }
      }
    }
  };
  public groupedBarChartType: ChartType = 'bar';
  public groupedBarChartPlugins = [];
  public groupedBarChartData: ChartData<'bar'> = {
    labels: ["1900", "1950", "1999", "2050"],
    datasets: [
      {
        label: "Africa",
        backgroundColor: this.themeCssVariables.danger,
        hoverBackgroundColor: this.themeCssVariables.danger,
        borderColor: this.themeCssVariables.danger,
        hoverBorderColor: this.themeCssVariables.danger,
        data: [133,221,783,2478]
      }, {
        label: "Europe",
        backgroundColor: this.themeCssVariables.primary,
        hoverBackgroundColor: this.themeCssVariables.primary,
        borderColor: this.themeCssVariables.primary,
        hoverBorderColor: this.themeCssVariables.primary,
        data: [408,547,675,734]
      }
    ],
  };



  /**
   * Mixed chart
   */
  public mixedChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { 
        display: true,
        labels: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 13,
            family: this.themeCssVariables.fontFamily
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: this.themeCssVariables.gridBorder,
        },
        ticks: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          display: true,
          color: this.themeCssVariables.gridBorder,
        },
        ticks: {
          color: this.themeCssVariables.secondary,
          font: {
            size: 12
          }
        }
      }
    }
  };
  public mixedChartType: ChartType = 'bar';
  public mixedChartPlugins = [];
  public mixedChartData: ChartData = {
    labels: ["1900", "1950", "1999", "2050"],
    datasets: [
      {
        label: "Europe",
        type: "line",
        borderColor: this.themeCssVariables.danger,
        backgroundColor: "transparent",
        data: [408,547,675,734],
        fill: false,
        pointBackgroundColor: this.themeCssVariables.light,
        pointHoverBackgroundColor: this.themeCssVariables.light,
        pointBorderColor: this.themeCssVariables.danger,
        pointHoverBorderColor: this.themeCssVariables.danger,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
        tension: .3
      }, {
        label: "Africa",
        type: "line",
        borderColor: this.themeCssVariables.primary,
        backgroundColor: "transparent",
        data: [133,221,783,2478],
        fill: false,
        pointBackgroundColor: this.themeCssVariables.light,
        pointHoverBackgroundColor: this.themeCssVariables.light,
        pointBorderColor: this.themeCssVariables.primary,
        pointHoverBorderColor: this.themeCssVariables.primary,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
        tension: .3
      }, {
        label: "Europe",
        type: "bar",
        backgroundColor: this.themeCssVariables.danger,
        hoverBackgroundColor: this.themeCssVariables.danger,
        borderColor: '',
        data: [408,547,675,734],
      }, {
        label: "Africa",
        type: "bar",
        backgroundColor: this.themeCssVariables.primary,
        hoverBackgroundColor: this.themeCssVariables.primary,
        borderColor: '',
        data: [133,221,783,2478]
      }
    ],
  };

  constructor() {}

}
