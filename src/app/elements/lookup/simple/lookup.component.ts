import { Component } from '@angular/core';
import { BaseLookupComponent } from '../baseLookup';

@Component({
  /* tslint:disable:component-selector */
  selector: 'lookup',
  /* tslint:enable:component-selector*/
  templateUrl: './lookup.component.html',
  styleUrls: ['../baseLookup.scss'],
  providers: []
})
export class LookupComponent extends BaseLookupComponent { }
