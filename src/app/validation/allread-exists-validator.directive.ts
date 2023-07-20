import { Directive, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HostService } from '../service/host.service';
import { RenterService } from '../service/renter.service';
import { Host } from '../model/host';
import { Renter } from '../model/renter';

@Directive({
  selector: '[appAllreadExistsValidator]',
  providers:[{provide:NG_ASYNC_VALIDATORS, useExisting: AllreadExistsValidatorDirective, multi:true}]
})
export class AllreadExistsValidatorDirective implements AsyncValidator {
  @Input('records') records: String[];

  constructor() { 
    this.records = [];
  }

  validate(control: AbstractControl<any, any>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    
    if (!control || Object.keys(control.errors || []).filter(u=> u!=='allreadyExists').length > 0) {
      return of(null);
    }

    for (let index = 0; index < this.records.length; index++) {
      if(this.records[index] === control.value) return of({ allreadyExists: true });
      
    }

    return of(null);
  }

}
