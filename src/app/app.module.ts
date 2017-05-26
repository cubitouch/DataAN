import { NgModule }      			from '@angular/core';
import { BrowserModule } 			from '@angular/platform-browser';
import { RouterModule }   			from '@angular/router';
import { Ng2PaginationModule } 		from 'ng2-pagination';
import { ChartsModule } 			from 'ng2-charts';

import { AppComponent }  			from './app.component';
import { PaginationComponent }  	from './pagination.component';
import { HomeComponent }  			from './home.component';
import { StatsComponent }  			from './stats.component';
import { SearchDeputeComponent }  	from './search.depute.component';
import { DetailDeputeComponent }  	from './detail.depute.component';
import { VotesDeputeComponent }  	from './votes.depute.component';
import { ReunionsDeputeComponent }  from './reunions.depute.component';
import { SearchPipe }  				from './search.pipe';

import { DeputesService } from './deputes.service';
import { VotesService } from './votes.service';
import { ReunionsService } from './reunions.service';

@NgModule({
  imports:      [ 
	BrowserModule,
	Ng2PaginationModule,
	ChartsModule,
	RouterModule.forRoot([
	  {
	    path: '',
	    redirectTo: '/home',
	    pathMatch: 'full'
	  },
	  {
		path: 'home',
		component: HomeComponent
	  },
	  {
		path: 'home/:debug',
		component: HomeComponent
	  },
	  {
		path: 'search-deputes',
		component: SearchDeputeComponent
	  },
	  {
		path: 'search-deputes/:id',
		component: DetailDeputeComponent
	  },
	  {
		path: 'search-deputes/:id/votes',
		component: VotesDeputeComponent
	  },
	  {
		path: 'search-deputes/:id/reunions',
		component: ReunionsDeputeComponent
	  },
	  {
		path: 'stats-deputes',
		component: StatsComponent
	  }
	])
  ],
  declarations: [
	  AppComponent,
	  PaginationComponent,
	  HomeComponent,
	  StatsComponent,
	  SearchDeputeComponent,
	  DetailDeputeComponent,
	  VotesDeputeComponent,
	  ReunionsDeputeComponent,
	  SearchPipe
  ],
  providers: [DeputesService,VotesService,ReunionsService],
  bootstrap:    [ AppComponent ]
})



export class AppModule { }