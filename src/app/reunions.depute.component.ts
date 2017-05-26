import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { Ng2PaginationModule } 		from 'ng2-pagination';

import { DeputesService } from './deputes.service';
import { ReunionsService } from './reunions.service';

import { Depute,DeputeIdentite,DeputeProfession,DeputePresence,Vote,Reunion,Mandat,Organe,ReunionParticipant,ReunionVm } from './models';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'my-app-detail-reunions',
  template: `
	<div  *ngIf="depute">
		<h3 class="ui dividing header">
			{{ depute.identite.civilite }} {{ depute.identite.nom }} {{ depute.identite.prenom }}
			<div class="ui label small">
				{{depute.reunions.length}} reunions(s)
			</div>
			<button class="ui right floated button tiny" (click)="goBack()"><i class="icon chevron left"></i></button>
		</h3>
			
		<div class="ui relaxed divided list">
			<div class="item" *ngFor="let reunion of depute.reunions | paginate: { itemsPerPage: 5, currentPage: p }">
				<i class="legal middle aligned icon"></i>
				<div class="content" style="width:100%">
					<a class="header">{{ reunion.libelle }}</a>
					<div class="description">
					{{ reunion.dateDebut }}
					<div class="ui label red right floated" [ngClass]="{
						'red':reunion.presence=='absent',
						'green':reunion.presence=='présent',
						'grey':reunion.presence=='excusé'}">{{ reunion.presence }}</div>
				</div>
			</div>
		</div>
		<div class="divider"></div>
		<pagination-controls-custom (id)="votes_pagination" (pageChange)="p = $event"></pagination-controls-custom>
			
		</div>
	</div>
  `,
})

export class ReunionsDeputeComponent implements OnInit {
	name = 'ReunionsDepute';
	
	depute: Depute;
	reunions: Array<Reunion>;
	
	constructor(
		private deputesService: DeputesService,
		private reunionsService: ReunionsService,
		private route: ActivatedRoute,
		private location: Location
	) {}
	ngOnInit(): void {
		this.route.params
			.switchMap((params: Params) => this.deputesService.getDepute(params['id']))
			.subscribe(depute => { this.depute = depute; console.log(depute); });

		this.route.params
			.switchMap((params: Params) => this.reunionsService.getReunionsForDepute(params['id']))
			.subscribe(reunions => { 
			this.reunions = reunions;
			
			this.depute.reunions = [];
			for(var i = 0; i < reunions.length; i++) {
				// console.log(reunions[i].participants.find(participant => participant.acteurRef==this.depute.id));
				var presence = reunions[i].participants.find(participant => participant.acteurRef==this.depute.id).presence;
				var reunion = new ReunionVm();
				reunion.libelle = reunions[i].libelle;
				reunion.presence = presence;
				reunion.dateDebut = reunions[i].dateDebut;
				this.depute.reunions.push(reunion);
			}
			console.log(this.depute.reunions);
		});
	}
	
	goBack(): void {
		this.location.back();
	}
	
}