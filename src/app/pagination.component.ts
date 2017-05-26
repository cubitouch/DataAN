import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'pagination-controls-custom',
  template: `
	<pagination-template  #p="paginationApi"
		[id]="id"
		[maxSize]="maxSize"
		(pageChange)="pageChange.emit($event)">
		<div *ngIf="!(autoHide && p.pages.length <= 1)" class="ui right floated pagination menu">
			<a class="icon item" [class.disabled]="p.isFirstPage()" *ngIf="directionLinks" (click)="p.previous()"> 
				<i class="left chevron icon"></i>
			</a>
			<div [class.current]="p.getCurrent() === page.value" *ngFor="let page of p.pages">
				<a class="item" (click)="p.setCurrent(page.value)" [class.disabled]="p.getCurrent() === page.value">
					{{ page.label }}
				</a>
			</div>
			<a class="icon item" [class.disabled]="p.isLastPage()" *ngIf="directionLinks" (click)="p.next()">
				<i class="right chevron icon"></i>
			</a>
		</div>
    </pagination-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PaginationComponent  {
	@Input() id: string;
    @Input() maxSize: number = 5;
    @Input()
    get directionLinks(): boolean {
        return this._directionLinks;
    }
    set directionLinks(value: boolean) {
        this._directionLinks = !!value && <any>value !== 'false';
    }
    @Input()
    get autoHide(): boolean {
        return this._autoHide;
    }
    set autoHide(value: boolean) {
        this._autoHide = !!value && <any>value !== 'false';
    }
    @Input() previousLabel: string = 'Previous';
    @Input() nextLabel: string = 'Next';
    @Input() screenReaderPaginationLabel: string = 'Pagination';
    @Input() screenReaderPageLabel: string = 'page';
    @Input() screenReaderCurrentLabel: string = `You're on page`;
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

    private _directionLinks: boolean = true;
    private _autoHide: boolean = false;
}