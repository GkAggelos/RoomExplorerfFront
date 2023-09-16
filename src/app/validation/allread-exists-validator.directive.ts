import { Directive, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';


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
      if(this.records[index].toLowerCase() === control.value.toLowerCase()) return of({ allreadyExists: true });
      
    }

    return of(null);
  }

}
