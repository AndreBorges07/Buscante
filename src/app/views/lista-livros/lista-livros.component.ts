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
  paginaAtual = 0; // Página inicial
  itensPorPagina = 10; // Quantidade de livros por página
  totalItensFixos: number | null = null;
  ultimaBusca: string | null = null;

  constructor(private service: LivroService) {
    this.campoBusca.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((valorDigitado) => valorDigitado.length >= 3),
        tap(() => this.paginaAtual = 0), // Reseta para a primeira página
        switchMap((valorDigitado) => this.service.buscar(valorDigitado, 0, this.itensPorPagina)), // Busca com a página resetada
        tap((resultado) => {
          // Atualiza os totais e os livros encontrados
          this.LivrosResultado = resultado;
          this.totalItensFixos = resultado.totalItems;
        }),
        map((resultado) => resultado.items ?? []),
        map((itens) => this.livrosResultadoParaLivros(itens))
      )
      .subscribe((livros) => {
        this.livrosEncontrados$ = of(livros); // Atualiza os livros encontrados
      });
}




  totalDeLivros$ = this.campoBusca.valueChanges.pipe( //serve para contar o total de livros encontrados.
      debounceTime(300), //Tempo de espera para fazer a busca.
      filter((valorDigitado) => valorDigitado.length >= 3), //Faz a busca a partir de 3 caracteres digitados.
      tap(() => console.log('Digitou')),
      distinctUntilChanged(), //Não faz a busca se o valor digitado for igual ao anterior.

      tap(() => this.paginaAtual = 0), //Serve para voltar para a primeira página quando o usuário digitar algo no campo de busca.
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      tap((resultado) => {
        // Apenas salva o total de itens na primeira vez ou em uma nova busca
        if (this.totalItensFixos === null || this.campoBusca.value !== this.ultimaBusca) {
          this.totalItensFixos = resultado.totalItems;
          this.ultimaBusca = this.campoBusca.value; // Salva o valor da última busca
        }
      }),

      // switchMap(valorDigitado =>
      //   this.service.buscar(valorDigitado, this.paginaAtual * this.itensPorPagina, this.itensPorPagina)
      // ), //switchMap serve para cancelar a requisição anterior e fazer uma nova requisição.
      // tap((retornoAPI) => console.log(retornoAPI.items)),

      map(resultado => {
        this.LivrosResultado = resultado;
        return resultado.totalItems;
      }),
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
    tap(() => {
      this.paginaAtual = 0, console.log(this.paginaAtual)
    }), //Serve para voltar para a primeira página quando o usuário digitar algo no campo de busca.


    switchMap(valorDigitado =>
      this.service.buscar(valorDigitado, this.paginaAtual * this.itensPorPagina, this.itensPorPagina)
    ),
    map(resultado => resultado.items ?? []), //esse ?? [] serve para caso o resultado seja nulo, ele retorna um array vazio.

    map(itens => this.livrosResultadoParaLivros(itens)),
    catchError((erro)=> {
      // this.mensagemErro = 'Erro ao buscar livros. Recarregue a página e tente novamente.'
      console.log(erro);
      return throwError(() => new Error(this.mensagemErro ='Erro ao buscar livros. Recarregue a página e tente novamente.'));

    }
    )

  )

  get totalPaginas(): number {
    if (this.totalItensFixos) {
      return Math.ceil(this.totalItensFixos / this.itensPorPagina);
    }
    return 0;
  }

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    items.map(item => new LivroVolumeInfo(item));
    console.log('próximo tap: ', items); //para debugar
    return items.map(item => new LivroVolumeInfo(item));
  }

  proximaPagina() {
    this.paginaAtual++;
    this.atualizarResultados();
  }

  paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.atualizarResultados();
    }
  }

  atualizarResultados() {
    const valorDigitado = this.campoBusca.value;
    if (valorDigitado && valorDigitado.length >= 3) {
      this.totalDeLivros$ = this.service.buscar(valorDigitado, this.paginaAtual * this.itensPorPagina, this.itensPorPagina).pipe(
        map(resultado => {
          this.LivrosResultado = resultado;
          return resultado.totalItems;
        })
      );

      this.livrosEncontrados$ = this.service.buscar(valorDigitado, this.paginaAtual * this.itensPorPagina, this.itensPorPagina).pipe(
        map(resultado => resultado.items ?? []),
        map(itens => this.livrosResultadoParaLivros(itens))
      );

    }
  }
}



