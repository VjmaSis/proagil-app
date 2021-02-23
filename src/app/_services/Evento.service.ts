import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  baseURL = 'http://localhost:52413/api/Evento';


  constructor(private http: HttpClient) {

   }

  getAllEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseURL);
  }

  getEventosByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseURL}/getByTema/${tema}`);
  }

  getEventoByID(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }

  // tslint:disable-next-line: typedef
  postEvento(evento: Evento) {
    return this.http.post(this.baseURL, evento);
  }

  // tslint:disable-next-line: typedef
  putEvento(id: number, evento: Evento) {
    return this.http.put(`${this.baseURL}/${id}`, evento);
  }

  deleteEvento(id: number) {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  postUpload(file: any, nome: string) {
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload, nome);

    return this.http.post(`${this.baseURL}/Upload`, formData);
  }

}
