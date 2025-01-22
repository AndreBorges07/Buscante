import { FormControl } from '@angular/forms';
import { Item, LivrosResultado } from './../../models/interfaces';
import { Component } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent{

  campoBusca = new FormControl(); //Serve para fazer a busca no campo de busca.
  mensagemErro = '';
  LivrosResultado: LivrosResultado;

  constructor(private service: LivroService) { }

  totalDeLivros$ = this.campoBusca.valueChanges.pipe( //serve para contar o total de livros encontrados.
      debounceTime(300), //Tempo de espera para fazer a busca.
      filter((valorDigitado) => valorDigitado.length >= 3), //Faz a busca a partir de 3 caracteres digitados.
      tap(() => console.log('Digitou')),
      distinctUntilChanged(), //Não faz a busca se o valor digitado for igual ao anterior.
      switchMap(valorDigitado => this.service.buscar(valorDigitado)), //switchMap serve para cancelar a requisição anterior e fazer uma nova requisição.
      map(resultado => this.LivrosResultado = resultado),
      catchError((erro)=> {
        console.log(erro);
        return of();

      })
  )

  //O $ no final do nome da variável é uma convenção para dizer que é um observable.
  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(300),
    filter((valorDigitado) => valorDigitado.length >= 3),

    distinctUntilChanged(),
    switchMap(valorDigitado => this.service.buscar(valorDigitado)),

    map(resultado => resultado.items ?? []), //esse ?? [] serve para caso o resultado seja nulo, ele retorna um array vazio.
    tap((retornoAPI) => console.log(retornoAPI)),

    map(itens => this.livrosResultadoParaLivros(itens)),
    catchError((erro)=> {
      // this.mensagemErro = 'Erro ao buscar livros. Recarregue a página e tente novamente.'
      console.log(erro);
      return throwError(() => new Error(this.mensagemErro ='Erro ao buscar livros. Recarregue a página e tente novamente.'));

    }
    )

  )

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => new LivroVolumeInfo(item));
  }


}



