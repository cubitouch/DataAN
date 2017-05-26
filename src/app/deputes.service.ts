import { Injectable } from '@angular/core';
import { Depute,DeputeIdentite,DeputeProfession,DeputePresence,Vote,Reunion,Mandat,Organe,OrganeMandat } from './models';

declare var zip: any;

@Injectable()
export class DeputesService {
	deputes = new Array<Depute>();
	organes = new Array<Organe>();
	dataJson = {};
	
	partiColors = {
		'Radical, républicain, démocrate et progressiste':	{'class':'pink',	value:"#e03997"},
		'Socialiste, écologiste et républicain':			{'class':'purple',	value:"#a333c8"},
		'Gauche démocrate et républicaine':					{'class':'red',		value:"#db2828"},
		'Les Républicains':									{'class':'blue',	value:"#1678c2"},
		'Union des démocrates et indépendants':				{'class':'teal',	value:"#009c95"},
		'Non inscrit':										{'class':'grey',	value:"#767676"},
	};
	getPartis():  Promise<any> {
		return Promise.resolve(this.partiColors);
	};
	
	dataLoaded = false;
	getDeputes(debug: boolean):  Promise<Array<Depute>> {
		if (!this.dataLoaded) {
			return new Promise(resolve => {
				this.setData(resolve, debug);
			});
		} else {
			return Promise.resolve(this.deputes);
		}
	}
	getDepute(id: string, debug: boolean): Promise<Depute> {
		return this.getDeputes(debug).then(deputes => deputes.find(depute => depute.id == id));
	}
	setData(resolve: any, debug: boolean): void {
		zip.workerScriptsPath = "/zipjs/";
			
		this.debug = debug;
		if (debug) {
			var dataUrl = '/AMO10_deputes_actifs_mandats_actifs_organes_XIV.json.zip';
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
							// console.log('deputes',self.dataJson);
							var exportData = self.dataJson["export"];
							var organeslength = exportData.organes.organe.length;
							for(var a = 0; a<organeslength; a++) {
								var organe = exportData.organes.organe[a];
								// console.log(organe);
								var organeFinalBase = new Organe();
								organeFinalBase.libelle 		= organe.libelle;
								organeFinalBase.libelleEdition 	= organe.libelleEdition;
								organeFinalBase.dateFin 		= organe.viMoDe.dateFin;
								organeFinalBase.codeType 		= organe.codeType;
								self.organes[organe.uid] = organeFinalBase;
								// if (organe.codeType == 'PARPOL' || organe.codeType=='GP')
									// console.log(organe);
							}
							
							var acteursLength = exportData.acteurs.acteur.length;
							for (var i = 0; i < acteursLength; i++){
								var acteur = exportData.acteurs.acteur[i];
								// console.log('acteur',acteur);
								var mandats = new Array<Mandat>();
								var parti = '';
								var groupe = '';
								for (var j = 0; j < acteur.mandats.mandat.length; j++){
									var mandat = acteur.mandats.mandat[j];
									// console.log('mandat',mandat);
									// if (mandat.dateFin == undefined)
										// console.log(acteur.mandats.mandat[j]);
									 // console.log(mandat,mandat.uid,self.organes,mandat.organes.organeRef.length);
									 var organes = new Array<OrganeMandat>();
									 if (mandat.organes.organeRef.constructor == Array) {
										for (var k = 0; k < mandat.organes.organeRef.length; k++) {
											var organe:any = self.organes[mandat.organes.organeRef[k]];
											if (organe.dateFin == null) {
												if (organe.codeType == 'PARPOL') {
													parti = organe.libelle;
												}
												else if (organe.codeType=='GP') {
													groupe = organe.libelle;
												}
												else {
													var organeFinal = new OrganeMandat();
													organeFinal.libelle =	organe.libelle;
													organeFinal.code 	=	organe.codeType;
													organeFinal.type 	=	mandat.infosQualite.codeQualite;
													organes.push(organeFinal);
												}
											}
										}
									 } else {
										var organe:any = self.organes[mandat.organes.organeRef];
										if (organe.dateFin == null) {
											if (organe.codeType == 'PARPOL') {
												parti = organe.libelle;
											}
											else if (organe.codeType=='GP') {
												groupe = organe.libelle;
											}
											else {
												var organeFinal = new OrganeMandat();
												organeFinal.libelle =	organe.libelle;
												organeFinal.code 	=	organe.codeType;
												organeFinal.type 	=	mandat.infosQualite.codeQualite;
												organes.push(organeFinal);
											}
										}
									 }
									 if (organes.length >0) {
										var mandatFinal = new Mandat();
										mandatFinal.acteurRef	= mandat.acteurRef;
										mandatFinal.dateDebut	= mandat.dateDebut;
										mandatFinal.dateFin		= mandat.dateFin;
										mandatFinal.organes		= organes;
										mandats.push(mandatFinal);
									 }
								}
								var deputeEmail = '';
								
								// console.log(acteur.adresses.adresse.length,acteur.adresses.adresse[0]['@xsi:type']);
								for(var l = 0; l < acteur.adresses.adresse.length; l++) {
									var adresse = acteur.adresses.adresse[l];
									// console.log(adresse['@xsi:type']);
									if (adresse['@xsi:type'] == 'AdresseMail_Type') {
										deputeEmail = adresse.valElec;
									}
								}
								// console.log(self.partiColors);
								// console.log(groupe);
								var depute = new Depute();
								
								depute.id 		= acteur.uid["#text"];
								depute.photo 	= 'http://www2.assemblee-nationale.fr/static/tribun/14/photos/'+acteur.uid["#text"].substring(2)+'.jpg';
								depute.sexe 	= (acteur.etatCivil.ident.civ=='M.'?'H':'F');
								depute.age  	= self.getAgeFromDate(acteur.etatCivil.infoNaissance.dateNais);
								
								depute.identite = new DeputeIdentite();
								depute.identite.civilite		= acteur.etatCivil.ident.civ;
								depute.identite.nom 			= acteur.etatCivil.ident.nom;
								depute.identite.prenom 			= acteur.etatCivil.ident.prenom;
								depute.identite.dateNaissance	= acteur.etatCivil.infoNaissance.dateNais;
								depute.identite.villeNaissance	= acteur.etatCivil.infoNaissance.villeNais;
								depute.identite.paysNaissance	= acteur.etatCivil.infoNaissance.paysNais;
								
								depute.profession = new DeputeProfession();
								depute.profession.libelle				= acteur.profession.libelleCourant;
								depute.profession.categorie				= acteur.profession.socProcINSEE.catSocPro;
								depute.profession.categorieEntreprise	= acteur.profession.socProcINSEE.famSocPro;
								
								depute.email	= deputeEmail,
								depute.mandats	= mandats,
								depute.parti	= parti,
								depute.groupe	= groupe,
								depute.color	= self.partiColors[groupe],
								depute.votes	= new Array<Vote>();
								
								// console.log(depute);
								self.deputes.push(depute);
							}
							
							console.log("debug activated for deputes service",self.debug);
							if (self.debug)
								console.log(JSON.stringify(self.deputes));
							resolve(self.deputes);
							self.dataLoaded = true;
						});
						reader.readAsText(data);
					});
			   });
			}, onerror);
		} else {
			var dataUrl = '/deputes.json.zip';
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
							self.deputes = JSON.parse(reader.result);								
							resolve(self.deputes);
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
	
	public getAgeFromDate(date:string): number {
		var ageDifMs = Date.now() - new Date(date).getTime();
		var ageDate = new Date(ageDifMs); // miliseconds from epoch
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
}