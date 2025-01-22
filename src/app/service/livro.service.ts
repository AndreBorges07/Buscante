import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Item, LivrosResultado } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LivroService {

  private readonly API = 'https://www.googleapis.com/books/v1/volumes';
  // https://developers.google.com/books/docs/overview?hl=pt-br
  constructor(private http: HttpClient) { }

  buscar(valorDigitado: string, pagina: number = 0, itensPorPagina: number = 10): Observable <LivrosResultado> {
    const params = new HttpParams()
      .append('q', valorDigitado)
      .append('startIndex', (pagina * itensPorPagina).toString())
      .append('maxResults', itensPorPagina.toString());
    return this.http.get<LivrosResultado>(this.API, {params})
  }
}
