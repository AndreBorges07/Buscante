import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'autoria' //Esse é um pipe customizado, que serve para pegar o primeiro autor da lista de autores.
})

export class AutoriaPipe implements PipeTransform {

  transform(autoria: string[]): string {
    if(autoria){
      return autoria[0];
    }
    return '';
  }

}
