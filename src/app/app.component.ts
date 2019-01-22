import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from './services/data.service';
import { IOption } from 'ng-select';
import { Chart } from 'chart.js';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataService]
})

export class AppComponent {
  constructor(private dataService: DataService) {
  }
  materias: Array<IOption> = [];
  posiciones: Array<IOption> = [];
  perfiles: Array<IOption> = [];
  abogados: Array<IOption> = [];
  jueces: Array<IOption> = [];
  seleccionados: any = {};
  prediccion: any = {};
  barChart1: any;
  pieChart: any;
  barChart2: any;
  totalesJuez: number;
  prediccionRecibida = false;
  @ViewChild('abogadoChartResoluciones') private abogadoChartResoluciones;
  @ViewChild('abogadoChartExito') private abogadoChartExito;
  @ViewChild('juezChart') private juezChart;
  ngOnInit(): void {
    this.getMaterias();
    this.getPositions();
    this.getProfiles();
  }

  getMaterias(): void {
    this.dataService.getRights().subscribe((res) => {
      this.materias = res.map((el) => ({ value: el.id, label: el.nombre }));
    },
      (err) => {
        console.error(err);
      });
  }

  getProfiles(): void {
    this.dataService.getProfiles().subscribe((res) => {
      this.perfiles = res.map((el) => ({ value: el, label: el }));
    },
      (err) => {
        console.error(err);
      });
  }

  getPositions(): void {
    this.dataService.getPositions().subscribe((res) => {
      this.posiciones = res.map((el) => ({ value: el, label: el }));
    },
      (err) => {
        console.error(err);
      });
  }

  getAbogados(q: string): void {
    this.dataService.getLawyersByName(q).subscribe((res) => {
      this.abogados = res.map((el) => ({ value: el.id, label: el.nombre }));
    },
      (err) => {
        console.error(err);
      });
  }

  getJueces(q: string): void {
    this.dataService.getJudgesByName(q).subscribe((res) => {
      this.jueces = res.map((el) => ({ value: el.id, label: el.nombre }));
    },
      (err) => {
        console.error(err);
      });
  }

  sendForm() {
    this.dataService.getPrediction(this.seleccionados).subscribe((res) => {
      this.prediccion = res;
      console.log(res);
      $('#myModal').modal('show');
      this.prediccionRecibida = true;
      this.barChart1 = new Chart(this.abogadoChartResoluciones.nativeElement, {
        type: 'horizontalBar',
        data: {
          labels: ['Abogado', 'Media'],
          datasets: [{
            label: 'Número de resoluciones',
            data: [this.prediccion.perfilPosicionResoluciones, this.prediccion.resolucionesMedias],
            backgroundColor: [
              'rgba(255, 206, 86, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          categoryPercentage: 0.5,
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          },
          legend: {
            display: false
          }
        }
      });

      this.barChart2 = new Chart(this.abogadoChartExito.nativeElement, {
        type: 'horizontalBar',
        data: {
          labels: ['Abogado', 'Media'],
          datasets: [{
            label: 'Tasa de éxito (%)',
            data: [this.prediccion.perfilPosicionExito * 100, this.prediccion.exitoMedio * 100],
            backgroundColor: [
              'rgba(255, 206, 86, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          categoryPercentage: 0.5,
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          },
          legend: {
            display: false
          }
        }
      });
      this.totalesJuez = this.prediccion.juezDesestimatorios + this.prediccion.juezEstimatorios + this.prediccion.juezParciales;
      this.pieChart = new Chart(this.juezChart.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Desestimatorios (%)', 'Estimatorios parciales (%)', 'Estimatorios (%)'],
          datasets: [{
            label: 'Fallo',
            data: [this.totalesJuez ? Math.round((this.prediccion.juezDesestimatorios / this.totalesJuez) * 100) : 0,
            this.totalesJuez ? Math.round((this.prediccion.juezEstimatorios / this.totalesJuez) * 100) : 0,
            this.totalesJuez ? Math.round((this.prediccion.juezParciales / this.totalesJuez) * 100) : 0],
            backgroundColor: [
              '#00447b',
              '#17a2b8',
              '#44cfad'
            ]
          }],
        },
        options: {
          cutoutPercentage: 70,
          legend: {
            display: false
          }
        },
      });
    },
      (err) => {
        console.error(err);
      });
  }

  validateForm() {
    if (this.seleccionados.materiaId && this.seleccionados.juezId && this.seleccionados.abogadoId
      && this.seleccionados.perfil && this.seleccionados.posicion) { return false; } else { return true; }
  }
}
