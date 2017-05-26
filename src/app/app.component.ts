import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
   <router-outlet></router-outlet>
  `,
})
export class AppComponent  {
	loading = true;
	loadingLabel = 'Chargement en cours...';
	name = 'Angular';
	
	constructor(){ }	
}