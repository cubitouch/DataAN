import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { Ng2PaginationModule } 		from 'ng2-pagination';

import { DeputesService } from './deputes.service';
import { VotesService } from './votes.service';

import { Depute,DeputeIdentite,DeputeProfession,DeputePresence,Vote,Reunion,Mandat,Organe,OrganeMandat } from './models';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'my-app-detail-votes',
  template: `
	<div  *ngIf="depute">
		<h3 class="ui dividing header">
			{{ depute.identite.civilite }} {{ depute.identite.nom }} {{ depute.identite.prenom }}
			<div class="ui label small">
				{{depute.votes.length}} vote(s)
			</div>
			<button class="ui right floated button tiny" (click)="goBack()"><i class="icon chevron left"></i></button>
		</h3>
			
		<div class="ui relaxed divided list">
			<div class="item" *ngFor="let vote of depute.votes | paginate: { itemsPerPage: 5, currentPage: p }">
				<i class="legal middle aligned icon"></i>
				<div class="content" style="width:100%">
					<a class="header">{{ vote.libelle }}</a>
					<div class="description">
					{{ vote.date }}
					<div class="ui label red right floated" [ngClass]="{
						'red':vote.position=='contre',
						'green':vote.position=='pour',
						'grey':vote.position=='abstention',
						'black':vote.position=='non votant'}">{{ vote.position }}</div>
				</div>
			</div>
		</div>
		<div class="divider"></div>
		<pagination-controls-custom (id)="votes_pagination" (pageChange)="p = $event"></pagination-controls-custom>
			
		</div>
	</div>
  `,
})

export class VotesDeputeComponent implements OnInit {
	name = 'VotesDepute';
	
	depute: any;
	votes: Array<Vote>;
	
	constructor(
		private deputesService: DeputesService,
		private votesService: VotesService,
		private route: ActivatedRoute,
		private location: Location
	) {}
	ngOnInit(): void {
		this.route.params
			.switchMap((params: Params) => this.deputesService.getDepute(params['id']))
			.subscribe(depute => { this.depute = depute; console.log(depute); });

		this.route.params
			.switchMap((params: Params) => this.votesService.getVotesForDepute(params['id']))
			.subscribe(votes => { 
			this.votes = votes;
			
			this.depute.votes = [];
			for(var i = 0; i < votes.length; i++) {
				var position = votes[i].individuels.find(individuel => individuel.id==this.depute.id).position;
				// console.log(votes[i],position);
				this.depute.votes.push({ libelle: votes[i].libelle, position: position, date: votes[i].date});
			}
			console.log(this.depute.votes);
		});
	}
	
	goBack(): void {
		this.location.back();
	}
	
}