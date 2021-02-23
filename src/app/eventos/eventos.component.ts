import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService} from 'ngx-bootstrap/modal';
import { from } from 'rxjs';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/Evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { error } from 'protractor';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  titulo = 'Eventos';
  eventosFiltrados: Evento[]  = [];
  eventos: Evento[] = [];
  evento = {} as Evento;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm = {} as FormGroup;
  modoSalvar = 'post';
  bodyDeletarEvento = '';
  file = {} as File;
  fileNameToUpload = '';
  dataAtual = '';

  constructor(private eventoService: EventoService
              // tslint:disable-next-line: align
              , private ModalService: BsModalService
              // tslint:disable-next-line: align
              , private fb: FormBuilder
              // tslint:disable-next-line: align
              , private localService: BsLocaleService
              // tslint:disable-next-line: align
              , private toastr: ToastrService
    ) {
    this.localService.use('pt-BR');
  }

  // tslint:disable-next-line: variable-name
  _filtroLista: any;
  get filtroLista(): string{
    return this._filtroLista;
  }
  set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEvento(this.filtroLista) : this.eventos;
  }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  filtrarEvento(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  // tslint:disable-next-line: typedef
  editarEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.modoSalvar = 'put';
    this.evento = Object.assign({},  evento);
    this.evento.imagemURL = '';
    this.fileNameToUpload = evento.imagemURL;
    this.registerForm.patchValue(this.evento);
  }

  // tslint:disable-next-line: typedef
  novoEvento(template: any) {
    this.openModal(template);
    this.modoSalvar = 'post';
  }

  // tslint:disable-next-line: typedef
  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.tema}`;
  }

  // tslint:disable-next-line: typedef
  openModal(template: any){
    this.registerForm.reset();
    template.show();
  }

  // tslint:disable-next-line: typedef
  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  // tslint:disable-next-line: typedef
  getEventos(){
    this.eventoService.getAllEventos().subscribe(
      // tslint:disable-next-line: variable-name
      (_evento: Evento[]) => {
        this.eventos = _evento;
        this.eventosFiltrados = _evento;
       }
    , error => {
      this.toastr.error(`Erro ao carregar os eventos: ${error}`);
    });
  }

  // tslint:disable-next-line: typedef
  validation() {
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(200)]],
      local: ['', [Validators.required, Validators.maxLength(150)]],
      dataEvento: ['', Validators.required],
      imagemURL: ['', [Validators.required, Validators.maxLength(2000)]],
      qtdPessoas: ['', [Validators.required, Validators.max(120000), Validators.min(3)]],
      telefone: ['', [Validators.required,  Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(300)]]
    });
  }

  // tslint:disable-next-line: typedef
  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          this.toastr.info('Evento deletado com sucesso');
          template.hide();
          this.getEventos();
        }, error => {
          this.toastr.error(`Erro ao deletar o evento: ${error}`);
        }
    );
  }

  onFileChange(event: any) {
    const header = new FileReader();

    if (event.target.files && event.target.files.length)
    {
      this.file = event.target.files;
      console.log(this.file);
    }
  }

  uploadImagem() {
    if (this.modoSalvar === 'post') {
      const nomeArquivo = this.evento.imagemURL.split('\\', 3);
      this.evento.imagemURL = nomeArquivo[2];
    } else {
      this.evento.imagemURL = this.fileNameToUpload;
    }
    

    this.eventoService.postUpload(this.file, this.evento.imagemURL).subscribe(
      () => {
        this.dataAtual = new Date().getMilliseconds().toString();
        this.getEventos();
      }
    );

  }
  // tslint:disable-next-line: typedef
  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post') {
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.postEvento(this.evento).subscribe(
            (novoEvento) => {
              this.toastr.success('Evento incluído com sucesso');
              template.hide();
              this.getEventos();
            }, error => {
              this.toastr.error(`Erro ao incluir o evento: ${error}`);
            }
          );
      } else {
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.putEvento(this.evento.id, this.evento).subscribe(
            (novoEvento) => {
              this.toastr.success('Evento alterado com sucesso');
              template.hide();
              this.getEventos();
            }, error => {
              this.toastr.error(`Erro ao editar o evento: ${error}`);
            }
          );
      }
    }
  }
}
