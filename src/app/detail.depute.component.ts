import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { Ng2PaginationModule } 		from 'ng2-pagination';

import { DeputesService } from './deputes.service';
import { VotesService } from './votes.service';
import { ReunionsService } from './reunions.service';

import { Depute,DeputeIdentite,DeputeProfession,DeputePresence,Vote,Reunion,ReunionVm,Mandat,Organe,DeputePresenceHoraire } from './models';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'my-app-detail',
  template: `
	<div  *ngIf="depute">
		<h2 class="ui dividing header">
			Député
			<button class="ui right floated button tiny" (click)="goBack()"><i class="icon chevron left"></i>&nbsp;Retour</button>
		</h2>
		<div class="ui cards">
			<div class="card">
				<div class="image">
					<img src="{{depute.photo}}" style="width:150px; margin: 0 auto;">
				</div>
				<div class="content">
					
					<div class="header">
						<i class="right floated large ui icon" [ngClass]="{'male blue': depute.sexe=='H', 'female red': depute.sexe=='F'}"></i>
						{{ depute.identite.civilite }} {{ depute.identite.nom }} {{ depute.identite.prenom }}
					</div>
					<div class="meta">
						Né(e) le {{ depute.identite.dateNaissance }}
					</div>
					<div class="description">
						{{ depute.identite.villeNaissance }} ({{ depute.identite.paysNaissance }})<br/>
						<a href="mailto:{{ depute.email }}">{{ depute.email }}</a>
					</div>
				</div>
				<div class="extra content">
					<div class="ui label"  [ngClass]="depute.color.class">
						{{ depute.groupe }}
					</div>
				</div>
			</div>
			<div class="card">
				<div class="content">
					<div class="header">
						{{ depute.profession.libelle }}
					</div>
					<div class="meta">
						{{ depute.profession.categorie }}
					</div>
					<div class="description">
						{{ depute.profession.categorieEntreprise }}
					</div>
				</div>
			</div>
			<div class="card" *ngIf="depute.votes != null">
				<div class="content">
					<div class="header">
						<i class="legal middle aligned icon"></i>
						{{depute.votes.length}} vote(s)
					</div>
				</div>
				<div class="extra content">
					<span class="ui label green">{{ depute.pour }} pour</span>
					<span class="ui label red right floated">{{ depute.contre }} contre</span>
				</div>
				<div class="extra content">
					<span class="ui label grey">{{ depute.abstention }} abstention</span>
					<span class="ui label black right floated">{{ depute.nonVotant }} non votant</span>
				</div>
				<div class="extra content">
					<a class="ui basic button right floated" routerLink="./votes">Ouvrir</a>
				</div>
			</div>
			<div class="card" *ngIf="depute.reunions != null">
				<div class="content">
					<div class="header">
						<i class="coffee middle aligned icon"></i>
						{{depute.reunions.length}} réunions(s)
					</div>
				</div>
				<div class="extra content">
					<span class="ui label green">{{ presence.present }} présent</span>
					<span class="ui label green right floated">{{ presenceHoraire.present }} heures</span>
				</div>
				<div class="extra content">
					<span class="ui label red">{{ presence.absent }} absent</span>
					<span class="ui label red right floated">{{ presenceHoraire.absent }} heures</span>
				</div>
				<div class="extra content">
					<span class="ui label grey">{{ presence.excuse }} excusé</span>
					<span class="ui label grey right floated">{{ presenceHoraire.excuse }} heures</span>
				</div>
				<div class="extra content">
					<a class="ui basic button right floated" routerLink="./reunions">Ouvrir</a>
				</div>
			</div>
			<div class="card">
				<div class="content">
					<div class="header">
						<i class="travel middle aligned icon"></i>
						{{depute.mandats.length}} mandat(s)
					</div>
				</div>
				<div class="extra content" *ngFor="let mandat of depute.mandats">
					<div class="description" *ngFor="let organe of mandat.organes">
						{{ organe.libelle }} ({{ organe.code }})
						<div class="meta">
							{{ organe.type }} depuis {{ mandat.dateDebut }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
  `,
})

export class DetailDeputeComponent implements OnInit {
	name = 'DetailDepute';
	
	depute: Depute;
	reunions: Array<Reunion>;
	votes: Array<Vote>;
	presence = new DeputePresence();
	presenceHoraire = new DeputePresenceHoraire();
	
	constructor(
		private deputesService: 	DeputesService,
		private votesService: 		VotesService,
		private reunionsService:	ReunionsService,
		private route: 				ActivatedRoute,
		private location: 			Location
	) {}
	ngOnInit(): void {
		console.log(this.route);
		this.route.params
			.switchMap((params: Params) => this.deputesService.getDepute(params['id']))
			.subscribe(depute => {
				this.depute = depute;
			});

		this.route.params
			.switchMap((params: Params) => this.votesService.getVotesForDepute(params['id']))
			.subscribe(votes => { 
			this.votes = votes;
			
			this.depute.votes = [];
			for(var i = 0; i < votes.length; i++) {
				var position = votes[i].individuels.find(individuel => individuel.id==this.depute.id).position;
				// console.log(votes[i],position);
				var vote = new Vote();
				vote.libelle	=	votes[i].libelle;
				vote.position	= position;
				vote.date		= votes[i].date;
				this.depute.votes.push(vote);
			}
			this.depute.pour = this.depute.votes.filter(vote => vote.position=='pour').length;
			this.depute.abstention = this.depute.votes.filter(vote => vote.position=='abstention').length;
			this.depute.contre = this.depute.votes.filter(vote => vote.position=='contre').length;
			this.depute.nonVotant = this.depute.votes.filter(vote => vote.position=='non votant').length;
			console.log(this.depute);
		});
		
		this.route.params
			.switchMap((params: Params) => this.reunionsService.getReunionsForDepute(params['id']))
			.subscribe(reunions => {
				this.reunions = reunions;
				
				this.depute.reunions.length = 0;
				for(var i = 0; i < reunions.length; i++) {
					var presence = reunions[i].participants.find(participant => participant.acteurRef==this.depute.id).presence;
					var reunion = new ReunionVm();
					reunion.libelle = reunions[i].libelle;
					reunion.presence = presence;
					reunion.dateDebut = reunions[i].dateDebut;
					reunion.duree = reunions[i].duree;
					this.depute.reunions.push(reunion);
					
					// console.log(this.reunions[i]);
					var participation = this.reunions[i].participants.find(reunion => reunion.acteurRef == this.depute.id);
					// console.log(participation);
					this.presence[participation.presence.replace('é','e')]++;
					this.presenceHoraire[participation.presence.replace('é','e')] = Math.ceil((this.presenceHoraire[participation.presence.replace('é','e')] + reunion.duree)*10)/10;
				}
				console.log(this.presence);
				console.log(this.presenceHoraire);
				console.log(this.depute.reunions);
			});
	}
	
	goBack(): void {
		this.location.back();
	}
	
}