import { Injectable } from '@angular/core';
import { Depute,DeputeIdentite,DeputeProfession,DeputePresence,Vote,Reunion,Mandat,Organe,ReunionParticipant } from './models';

declare var zip: any;

@Injectable()
export class ReunionsService {
	reunions = Array<Reunion>();
	dataJson = {};
	debug: boolean;
	
	dataLoaded = false;
	getReunions(debug: boolean):  Promise<Array<Reunion>> {
		if (!this.dataLoaded) {
			return new Promise(resolve => {
				this.setData(resolve, debug);
			});
		} else {
			return Promise.resolve(this.reunions);
		}
	}
	getReunionsForDepute(id: string, debug: boolean): Promise<Array<Reunion>> {
		return this.getReunions(debug).then(reunions => reunions.filter(reunion => reunion.participants.filter(participant => participant.acteurRef == id).length > 0));
	}
	
	setData(resolve: any, debug: boolean): void {
		zip.workerScriptsPath = "/zipjs/";
			
		this.debug = debug;
		if (debug) {
			var dataUrl = '/Agenda_XIV.json.zip';			
			console.log(dataUrl);
			
			var self = this;
			zip.createReader(new zip.HttpReader(dataUrl), function(zipReader: any){
			   zipReader.getEntries(function(entries: any){		
					var writer;
					// console.log(entries[0]);	
					// self.loadingLabel = 'Construction des données...';	
					entries[0].getData(new zip.BlobWriter("text/plain"), function(data: any) {
						// close the reader and calls callback function with uncompressed data as parameter
						zipReader.close();
						// console.log(data);
						var reader = new FileReader();
						reader.addEventListener("loadend", function() {
							self.dataJson = JSON.parse(reader.result);						
							console.log('reunions',self.dataJson);
							
							var reunionsLength = self.dataJson["reunions"].reunion.length;
							for(var i =0; i < reunionsLength; i++) {
								var participantsFinal = new Array<ReunionParticipant>();
								var reunion = self.dataJson["reunions"].reunion[i];
								var statut = '';
								if (reunion.cycleDeVie == null) {
									statut = reunion.statut;
								} else {
									statut = reunion.cycleDeVie.etat.toLowerCase();
								}
								// console.log(statut);
								if (reunion.participants != null && statut == "confirmé") {
									if (reunion.participants.participantsInternes != null) {
										// console.log(reunion);
										var participants = reunion.participants.participantsInternes.participantInterne;
										for(var j = 0; j < participants.length; j++) {
											var participantFinal = new ReunionParticipant();
											participantFinal.acteurRef = participants[j].acteurRef;
											participantFinal.presence = participants[j].presence;
											participantsFinal.push(participantFinal);
										}
									}
									/*
									présent
									absent
									excusé
									*/
									var libelle = '';
									if (reunion.ODJ.convocationODJ != null ) {
										// console.log(reunion.ODJ.convocationODJ.item);
										if (reunion.ODJ.convocationODJ.item.constructor != Array) {
											libelle = reunion.ODJ.convocationODJ.item;
										} else {
											libelle = reunion.ODJ.convocationODJ.item[0];
										}
									} else if (reunion.ODJ.resumeODJ != null ) {
										if (reunion.ODJ.resumeODJ.item.constructor == Array) {
											libelle = reunion.ODJ.resumeODJ.item.join(' ');
										} else  {
											libelle = reunion.ODJ.resumeODJ.item;
										}
									} else {
										console.log(reunion);
									}
									var reunionFinal = new Reunion();
									reunionFinal.libelle		= libelle;
									reunionFinal.dateDebut		= reunion.timeStampDebut;
									reunionFinal.dateFin		= reunion.timeStampFin;
									reunionFinal.participants	= participantsFinal;
									reunionFinal.duree			= self.getDuree(reunion.timeStampDebut, reunion.timeStampFin);
									reunionFinal.type			= reunion.typeReunion;
									self.reunions.push(reunionFinal);
								}
							}
							
							// console.log("debug activated for reunions service",self.debug);
							// if (self.debug)
								// console.log(JSON.stringify(self.reunions));
							resolve(self.reunions);
							self.dataLoaded = true;
						});
						reader.readAsText(data);
					});
			   });
			}, onerror);
		
		} else {
			var dataUrl = '/reunions.json.zip';
			console.log(dataUrl);
			
			var self = this;
			zip.createReader(new zip.HttpReader(dataUrl), function(zipReader: any){
			   zipReader.getEntries(function(entries: any){		
					var writer;
						// console.log("zipReader.getEntries");
					entries[0].getData(new zip.BlobWriter("text/plain"), function(data: any) {
						// close the reader and calls callback function with uncompressed data as parameter
						zipReader.close();
						// console.log("zip.BlobWriter");
						var reader = new FileReader();
						reader.addEventListener("loadend", function() {
							// console.log("loadend");
							self.reunions = JSON.parse(reader.result);								
							resolve(self.reunions);
							self.dataLoaded = true;
						});
						reader.readAsText(data);
					}
			   }
			}
		}
	}
	
	public getDuree(dateDebut: string, dateFin: string): number{
		if (dateDebut == undefined || dateFin == undefined)
			return 0;
		
		var debut = new Date(dateDebut);
		var fin = new Date(dateFin);
		
		var diff = Math.abs(debut.getTime() - fin.getTime());
		var diffHours = Math.round(diff / (1000 * 3600) * 10) /10;

		return diffHours;		
	}
	
	constructor(){
		
	}
}