import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Item, LivrosResultado } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LivroService {

  private readonly API = 'https://www.googleapis.com/books/v1/volumes';
  // https://www.googleapis.com/books/v1/volumes?q=search+terms
  constructor(private http: HttpClient) { }

  buscar(valorDigitado: string): Observable <Item[]> {
    const params = new HttpParams().append('q', valorDigitado);
    return this.http.get<LivrosResultado>(this.API, {params}).pipe(
      // tap(retornoAPI => console.log('Fluxo do tamp ', retornoAPI)), //tap serve de apoio no momento de debugar.
      map(resultado => resultado.items),
      // tap(resultado=> console.log('Fluxo do map', resultado))
    );
  }
}
