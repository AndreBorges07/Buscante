import { FormControl } from '@angular/forms';
import { Item } from './../../models/interfaces';
import { Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent{

  campoBusca = new FormControl(); //Serve para fazer a busca no campo de busca.

  constructor(private service: LivroService) { }

  //O $ no final do nome da variável é uma convenção para dizer que é um observable.
  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(300), //Tempo de espera para fazer a busca.
    filter((valorDigitado) => valorDigitado.length >= 3), //Faz a busca a partir de 3 caracteres digitados.
    tap(() => console.log('Digitou')),
    distinctUntilChanged(), //Não faz a busca se o valor digitado for igual ao anterior.
    switchMap(valorDigitado => this.service.buscar(valorDigitado)), //switchMap serve para cancelar a requisição anterior e fazer uma nova requisição.

    tap((retornoAPI) => console.log(retornoAPI)),
    map(itens => this.livrosResultadoParaLivros(itens))

  )

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => new LivroVolumeInfo(item));
  }


}



