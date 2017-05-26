import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router  }   from '@angular/router';
import { OnInit } from '@angular/core';
import { DeputesService } from './deputes.service';
import { VotesService } from './votes.service';
import { ReunionsService } from './reunions.service';

import { Depute,DeputeIdentite,DeputeProfession,DeputePresence,Vote,Reunion,Mandat,Organe,ReunionVm } from './models';

@Component({
  selector: 'my-app-home',
  template: `
	<h1 class="ui dividing header">Assemblée nationale</h1>
	<div class="ui segment" *ngIf="loading<3">
      <div class="ui active dimmer" style="height:64px;">
        <div class="ui tiny text loader">{{ loadingLabel }}</div>
      </div>
    </div>
	<div class="ui cards" *ngIf="loading==3">
		<div class="card">
			<div class="content">
				<i class="users icon right floated large"></i>
				<div class="header">
					{{deputes.length}} Députés 
				</div>
				<div class="meta">
					Annuaire
				</div>
				<div class="description">
					Rechercher un député en fonction
				</div>
			</div>
			<div class="extra content">
				<a class="ui basic button right floated" routerLink="/search-deputes">Ouvrir</a>
			</div>
		</div>
		<div class="card">
			<div class="content">
				<i class="pie chart icon right floated large"></i>
				<div class="header">
					Statistiques
				</div>
				<div class="meta">
					Homme / Femme
				</div>
				<div class="description">
					Répartition homme / femme
				</div>
			</div>
			<div class="extra content">
				<a class="ui basic button right floated" routerLink="/stats-deputes">Ouvrir</a>
			</div>
		</div>
	</div>
  `,
})
export class HomeComponent implements OnInit {
	name = 'Home';
	
	loading = 0;
	loadingLabel = 'Chargement en cours...';
	deputes = Array<Depute>();
	votes = Array<Vote>();
	reunions = Array<Reunion>();
	
	debug:	boolean;
	
	constructor(
		private deputesService: DeputesService,
		private votesService: VotesService,
		private reunionsService: ReunionsService,
		private route: ActivatedRoute,
		private router: Router
	) {
		var self = this;
		
		this.route
		.queryParams
		.subscribe(params => {
			// Defaults to 0 if no query param provided.
			this.debug = params.debug != undefined;
			// console.log("debug activated",this.debug);
		});
		// console.log(params["debug"]);
	}
	ngOnInit(): void {
		var self = this;
		this.deputesService.getDeputes(self.debug).then(deputes => {
			self.deputes = deputes;
			self.loading++;
			// console.log(self.loading);
		});
		this.votesService.getVotes(self.debug).then(votes => {
			self.votes = votes;
			self.loading++;
			// console.log(self.loading);
		});
		this.reunionsService.getReunions(self.debug).then(reunions => {
			self.reunions = reunions;
			self.loading++;
			// console.log(self.loading);
		});
		
	}
}