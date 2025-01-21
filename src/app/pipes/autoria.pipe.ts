import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'autoria'
})
// Em alguns casos existe mais de um autor, então é necessário pegar o primeiro autor da lista.
export class AutoriaPipe implements PipeTransform {

  transform(autoria: string[]): string {
    if(autoria){
      return autoria[0];
    }
    return '';
  }

}
