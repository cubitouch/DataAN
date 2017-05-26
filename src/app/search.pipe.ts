import {Pipe, PipeTransform} from '@angular/core';
import { Depute } from './models';
@Pipe({ 
    name: 'searchPipe'
}) 
export class SearchPipe implements PipeTransform {
    transform(items: Array<Depute>, filter: string): Array<any> {
		var filterNoCase = filter.toLowerCase();
	   	return (filter === undefined ? items : items.filter(item => (
			(item.identite.civilite.toLowerCase() + ' ' + item.identite.nom.toLowerCase() + ' ' + item.identite.prenom.toLowerCase()).indexOf(filterNoCase) != -1 ||
			(item.identite.nom.toLowerCase()).indexOf(filterNoCase) != -1 ||
			(item.identite.prenom.toLowerCase()).indexOf(filterNoCase) != -1
		)));
    } 
}