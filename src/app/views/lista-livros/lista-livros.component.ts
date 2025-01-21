import { Item, VolumeInfo } from './../../models/interfaces';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Livro } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent implements OnDestroy{

  listaLivros: Livro[];
  campoBusca: string = '';
  subscriptions: Subscription
  livro: Livro

  constructor(private service: LivroService) { }

  buscarLivros(){
    this.subscriptions = this.service.buscar(this.campoBusca).subscribe({
      next: (itens) => {
        this.listaLivros = this.livrosResultadoParaLivros(itens);
      },
      error: erro => console.error(erro),
      // complete: () => console.log('Busca finalizada') //Só serve pra mostrar que a busca foi finalizada.

    }
    );
  }

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => new LivroVolumeInfo(item));
  }

  ngOnDestroy(): void {
      this.subscriptions.unsubscribe(); //Serve para desinscrever o observable, que é o "bucar" dentro do "buscarLivros".
  }
}



