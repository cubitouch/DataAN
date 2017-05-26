import { Component } 		from '@angular/core';
import { OnInit } 			from '@angular/core';
import { DeputesService } 	from './deputes.service';
import { Location }         from '@angular/common';

import { Depute,DeputeIdentite,DeputeProfession,DeputePresence,Vote,Reunion,Mandat,Organe } from './models';

@Component({
  selector: 'my-app-stats',
  template: `
	<h2 class="ui dividing header">
		Statistiques de parité
		<button class="ui right floated button tiny" (click)="goBack()"><i class="icon chevron left"></i>&nbsp;Retour</button>
	</h2>
	<div class="ui cards">
	
	  <div class="ui card" style="display: block">
		<div class="image">
			<canvas baseChart
				[data]="pieChartDataSex"
				[labels]="pieChartLabelsSex"
				[colors]="pieChartColorsSex"
				[chartType]="pieChartTypeSex"></canvas>
		</div>
		<div class="content">
			<div class="header">
				Par sexe
			</div>
		</div>
	  </div>
	  
	  <div class="ui card" style="display: block" *ngIf="barChartAvailableSexAndAge">
		<div class="image">
			<canvas height="300" baseChart
				[datasets]="barChartDataSexAndAge"
				[labels]="barChartLabelsSexAndAge"
				[colors]="barChartColorsSexAndAge"
				[options]="barChartOptionsSexAndAge"
				[legend]="true"
				[chartType]="barChartTypeSexAndAge"></canvas>
		</div>
		<div class="content">
			<div class="header">
				Par sexe et age
			</div>
		</div>
	  </div>
	  
	  <div class="ui card" style="display: block; width: 518px;">
		<div class="image">
			<canvas baseChart
				[data]="pieChartDataParti"
				[labels]="pieChartLabelsParti"
				[colors]="pieChartColorsParti"
				[chartType]="pieChartTypeParti"></canvas>
		</div>
		<div class="content">
			<div class="header">
				Par parti ({{deputes.length}})
			</div>
		</div>
	  </div>
	  <div class="ui card" style="display: block; width: 518px;">
		<div class="image">
			<canvas baseChart
				[data]="pieChartDataFemmeParti"
				[labels]="pieChartLabelsParti"
				[colors]="pieChartColorsParti"
				[chartType]="pieChartTypeParti"></canvas>
		</div>
		<div class="content">
			<div class="header">
				Femmes par parti ({{pieChartDataSex[1]}})
			</div>
		</div>
	  </div>
	  <div class="ui card" style="display: block; width: 518px;">
		<div class="image">
			<canvas baseChart
				[data]="pieChartDataHommeParti"
				[labels]="pieChartLabelsParti"
				[colors]="pieChartColorsParti"
				[chartType]="pieChartTypeParti"></canvas>
		</div>
		<div class="content">
			<div class="header">
				Hommes par parti ({{pieChartDataSex[0]}})
			</div>
		</div>
	  </div>
	  
  </div>
  `,
})
export class StatsComponent implements OnInit {
	name = 'Stats';
	
	deputes = new Array<Depute>();
	
	hommes = new Array<Depute>();
	femmes = new Array<Depute>();
	
	public pieChartLabelsSex:string[] = ['Hommes', 'Femmes'];
	public pieChartDataSex:number[] = [0,0];
	public pieChartColorsSex:any[] = [ {backgroundColor:['#36A2EB','#FF6384']} ];
	public pieChartTypeSex:string = "pie";
	
	public barChartAvailableSexAndAge:boolean =  false;
	public barChartColorsSexAndAge:any[] = [ {backgroundColor:['#36A2EB','#36A2EB','#36A2EB','#36A2EB','#36A2EB']},{backgroundColor:['#FF6384','#FF6384','#FF6384','#FF6384','#FF6384']}];
	public barChartDataSexAndAge:any[] = [
		{data:[0,0,0,0,0], label:'Hommes'},
		{data:[0,0,0,0,0], label:'Femmes'}
	];
	public barChartLabelsSexAndAge:string[] = [
		'18-29',
		'30-44',
		'45-59',
		'60-74',
		'75+'
	];
	public barChartOptions:any = {
		scaleShowVerticalLines: true,
		responsive: false
	};
	public barChartTypeSexAndAge:string = "bar";
	
	public pieChartLabelsParti:string[] = [];
	public pieChartColorsParti:any[] = [ {backgroundColor:[]} ];	
	public pieChartTypeParti:string = "pie";
	
	public pieChartDataFemmeParti:number[] = [];
	public pieChartDataHommeParti:number[] = [];
	public pieChartDataParti:number[] = [];
	
	constructor(
		private deputesService: DeputesService,
		private location: Location
	) {}
	ngOnInit(): void {
		var self = this;
		this.deputesService.getPartis().then(function(partis) {
			console.log(partis);
			for (var parti in partis) {
				self.pieChartLabelsParti.push(parti);
				self.pieChartColorsParti[0].backgroundColor.push(partis[parti].value);
				self.pieChartDataHommeParti[parti]=0;
				self.pieChartDataFemmeParti[parti]=0;
				self.pieChartDataParti[parti]=0;
			}
		});
		this.deputesService.getDeputes().then(function(deputes) {
			self.deputes = deputes;
			
			for(var i = 0; i < deputes.length; i++) {
				var trancheIndex = 0;
				if (deputes[i].age < 30) {
					trancheIndex = 0;
				} else if (deputes[i].age < 45) {
					trancheIndex = 1;
				} else if (deputes[i].age < 60) {
					trancheIndex = 2;
				} else if (deputes[i].age < 75) {
					trancheIndex = 3;
				} else {
					trancheIndex = 4;
				}
				if (deputes[i].sexe == 'H') {
					self.hommes.push(deputes[i]);
					self.barChartDataSexAndAge[0].data[trancheIndex]++;
					self.pieChartDataHommeParti[deputes[i].groupe]++;
				} else {
					self.femmes.push(deputes[i]);
					self.barChartDataSexAndAge[1].data[trancheIndex]++;
					self.pieChartDataFemmeParti[deputes[i].groupe]++;
				}
				self.pieChartDataParti[deputes[i].groupe]++;
			}
			
			var pieChartDataHommePartiFinal = [];
			for(var partiComptage in self.pieChartDataHommeParti) {
				pieChartDataHommePartiFinal.push(self.pieChartDataHommeParti[partiComptage]);
			}
			self.pieChartDataHommeParti = pieChartDataHommePartiFinal;
			
			var pieChartDataFemmePartiFinal = [];
			for(var partiComptage in self.pieChartDataFemmeParti) {
				pieChartDataFemmePartiFinal.push(self.pieChartDataFemmeParti[partiComptage]);
			}
			self.pieChartDataFemmeParti = pieChartDataFemmePartiFinal;
			
			// console.log(self.pieChartDataParti);
			var pieChartDataPartiFinal = [];
			for(var partiComptage in self.pieChartDataParti) {
				pieChartDataPartiFinal.push(self.pieChartDataParti[partiComptage]);
			}
			self.pieChartDataParti = pieChartDataPartiFinal;
			
			console.log(self.pieChartDataParti);
			console.log(self.pieChartDataHommeParti);
			console.log(self.pieChartDataFemmeParti);
			
			self.pieChartDataSex = [self.hommes.length, self.femmes.length];
			self.barChartAvailableSexAndAge = true;
		});
		
	}
	public chartHovered(e:any):void {
		console.log(e);
	}
	
	goBack(): void {
		this.location.back();
	}
}