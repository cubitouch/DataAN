import { Component, OnInit } 		from '@angular/core';
import { Location }         		from '@angular/common';
import { Ng2PaginationModule } 		from 'ng2-pagination';
import { SearchPipe }  				from './search.pipe';

import { DeputesService } 			from './deputes.service';

import { Depute,DeputeIdentite,DeputeProfession,DeputePresence,Vote,Reunion,Mandat,Organe,ReunionParticipant } from './models';

@Component({
  selector: 'my-app-search',
  template: `
	<h2 class="ui dividing header">
		Députés <div class="ui label"><i class="users icon"></i>&nbsp;{{deputes.length}}</div>
		<button class="ui right floated button tiny" (click)="goBack()"><i class="icon chevron left"></i>&nbsp;Retour</button>
	</h2>
	<div class="ui form">
		<div class="field">
		<div class="ui icon input">
			<input type="text" placeholder="Recherche..." #searchFilter (keyup)="0"/>
			<i class="search icon"></i>
		</div>
		</div>
	</div>
	<div class="divider"></div>
	<div class="ui relaxed divided list">
		<a class="item" *ngFor="let depute of deputes
							| searchPipe:searchFilter.value
							| paginate: { itemsPerPage: 10, currentPage: p }" [routerLink]="['/search-deputes', depute.id]">
			<i class="middle aligned icon" [ngClass]="{'male blue': depute.sexe=='H', 'female red': depute.sexe=='F'}"></i>
			<div class="content" style="width: 100%;">
				<a class="header">{{ depute.identite.civilite }} {{ depute.identite.nom }} {{ depute.identite.prenom }}</a>
				<div class="description">
					{{ depute.mandats.length }} mandat(s)
					<span class="ui label mini right floated" [ngClass]="depute.color.class">{{ depute.groupe }}</span>
				</div>
			</div>
		</a>
	</div>
	<div class="divider"></div>
	<pagination-controls-custom (id)="search_pagination" (pageChange)="p = $event"></pagination-controls-custom>
  `,
})

export class SearchDeputeComponent implements OnInit {
	name = 'SearchDepute';
	
	deputes = Array<Depute>();
	
	constructor(
		private deputesService: DeputesService,
		private location: Location
	) {}
	ngOnInit(): void {
		var self = this;
		this.deputesService.getDeputes().then(deputes => {
			self.deputes = deputes;
			console.log(self.deputes);
		});
		
	}
	
	goBack(): void {
		this.location.back();
	}

}