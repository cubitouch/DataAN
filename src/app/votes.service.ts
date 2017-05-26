import { Injectable } from '@angular/core';
import { Depute,DeputeIdentite,DeputeProfession,DeputePresence,Vote,Reunion,Mandat,Organe,VoteIndividuel } from './models';

declare var zip: any;

@Injectable()
export class VotesService {
	votes = Array<Vote>();
	dataJson = {};
	debug:	boolean;
	
	dataLoaded = false;
	getVotes(debug: boolean):  Promise<Array<Vote>> {
		if (!this.dataLoaded) {
			return new Promise(resolve => {
				this.setData(resolve, debug);
			});
		} else {
			return Promise.resolve(this.votes);
		}
	}
	getVotesForDepute(id: any, debug: boolean): Promise<Array<Vote>> {
		return this.getVotes(debug).then(votes => votes.filter(vote => vote.individuels.filter(individuel => individuel.id == id).length > 0));
	}
	
	setData(resolve: any, debug: boolean): void {
		zip.workerScriptsPath = "/zipjs/";
			
		this.debug = debug;
		if (debug) {
			var dataUrl = '/Scrutins_XIV.json.zip';
			console.log(dataUrl);
			// this.loadingLabel = 'Extraction des données...';
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
							// console.log('votes',self.dataJson);
							var scrutins = self.dataJson["scrutins"].scrutin;
							
							// pour chague scrutin
							for(var i = 0; i < scrutins.length; i++) {
								var scrutin = scrutins[i];
								var individuels = [];
								var ventilation = scrutin.ventilationVotes.organe.groupes.groupe;
								// console.log(scrutin,ventilation);
								// pour chague groupe
								for(var j = 0; j < ventilation.length; j++) {
									var decompte = ventilation[j].vote.decompteNominatif;
									
									if (decompte.abstentions && decompte.abstentions.votant)
									for(var k = 0; k < decompte.abstentions.votant.length; k++) {
										var votant = decompte.abstentions.votant[k];
										var individuel = new VoteIndividuel();
										individuel.id = votant.acteurRef;
										individuel.position = "abstention";
										individuels.push(individuel);
									}
									
									if (decompte.contres && decompte.contres.votant)
									for(var k = 0; k < decompte.contres.votant.length; k++) {
										var votant = decompte.contres.votant[k];
										var individuel = new VoteIndividuel();
										individuel.id = votant.acteurRef;
										individuel.position = "contre";
										individuels.push(individuel);
									}
									
									if (decompte.pours && decompte.pours.votant)
									for(var k = 0; k < decompte.pours.votant.length; k++) {
										var votant = decompte.pours.votant[k];
										var individuel = new VoteIndividuel();
										individuel.id = votant.acteurRef;
										individuel.position = "pour";
										individuels.push(individuel);
									}
									
									if (decompte.nonVotants && decompte.nonVotants.votant)
									for(var k = 0; k < decompte.nonVotants.votant.length; k++) {
										var votant = decompte.nonVotants.votant[k];
										var individuel = new VoteIndividuel();
										individuel.id = votant.acteurRef;
										individuel.position = "non votant";
										individuels.push(individuel);
									}
									
								}
								var vote = new Vote();
								vote.libelle		= scrutin.titre;
								vote.date			= scrutin.dateScrutin;
								vote.resultat		= scrutin.sort.code;
								vote.nbPour			= scrutin.syntheseVote.decompte.pour;
								vote.nbContre		= scrutin.syntheseVote.decompte.contre;
								vote.nbAbstention	= scrutin.syntheseVote.decompte.abstention;
								vote.nbNonVotant	= scrutin.syntheseVote.decompte.nonVotant;
								vote.individuels	= individuels;
								self.votes.push(vote);
							}
							
							// console.log("debug activated for votes service",self.debug);
							// if (self.debug)
								// console.log(JSON.stringify(self.votes));
							resolve(self.votes);
							self.dataLoaded = true;
						});
						reader.readAsText(data);
					});
			   });
			}, onerror);
			
		} else {
			var dataUrl = '/votes.json.zip';
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
							self.votes = JSON.parse(reader.result);								
							resolve(self.votes);
							self.dataLoaded = true;
						});
						reader.readAsText(data);
					}
			   }
			}
		}
	}
	
	constructor(){
		
	}
}