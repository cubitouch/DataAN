export class Depute {
  id: 			string;
  photo: 		string;
  identite: 	DeputeIdentite;
  sexe:			string;
  age:			number;
  email:		string;
  color:		string;
  groupe:		string;
  parti:		string;
  profession:	DeputeProfession;
  
  votes:		Vote[];
  pour:			number;
  contre:		number;
  abstention:	number;
  nonVotant:	number;
  
  reunions:		ReunionVm[];
  presence:		DeputePresence;
  
  mandats:		Mandat[];
  
	constructor() {
		this.reunions = new Array<ReunionVm>();
		this.mandats = new Array<Mandat>();
	}
}
 
export class DeputeIdentite {
	civilite: 		string;
	nom: 			string;
	prenom: 		string;
	dateNaissance:	string;
	villeNaissance:	string;
	paysNaissance:	string;
}
export class DeputeProfession {
	libelle:				string;
	categorie:				string;
	categorieEntreprise:	string;
}
export class DeputePresence {
	present:	number;
	absent:		number;
	excuse:		number;
	
	constructor() {
		this.present 	= 0;
		this.absent		= 0;
		this.excuse		= 0;
	}
}
export class DeputePresenceHoraire {
	present:	number;
	absent:		number;
	excuse:		number;
	
	constructor() {
		this.present 	= 0;
		this.absent		= 0;
		this.excuse		= 0;
	}
}

export class Vote {
	libelle:		string;
	date:			string;
	resultat:		string;
	nbPour:			number;
	nbContre:		number;
	nbAbstention:	number;
	nbNonVotant:	number;
	individuels:	Array<VoteIndividuel>;
	
	position: string;
	
	constructor() {
		this.individuels 	= new Array<VoteIndividuel>();
	}
}
export class VoteIndividuel {
	id:			string;
	position:	string;
}
export class Reunion {
	libelle:			string;
	dateDebut:			string;
	dateFin:			string;
	duree:				number;
	participants: 		Array<ReunionParticipant>;
	type:				string;
	
	constructor() {
		this.participants 	= new Array<ReunionParticipant>();
	}
}
export class ReunionParticipant {
	acteurRef:			string;
	presence:			string;
}
export class ReunionVm {
	libelle:			string;
	presence:			string;
	dateDebut:			string;
	duree:				number;
	
	constructor() {
	}
}
export class Mandat {
	acteurRef:	string;
	organes:	OrganeMandat[];
	dateDebut:	string;
	dateFin:	string;
	
	constructor() {
		this.organes 	= new Array<OrganeMandat>();
	}
}
export class Organe {
	libelle:		string;
	libelleEdition:	string;
	dateFin:		string;
	codeType:		string;
}
export class OrganeMandat {
	libelle:	string;
	code:		string;
	type:		string;
}