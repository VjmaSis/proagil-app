import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/_models/Evento';
import { EventoService } from 'src/app/_services/Evento.service';
import { ActivatedRoute } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-evento-edit',
  templateUrl: './eventoEdit.component.html',
  styleUrls: ['./eventoEdit.component.css']
})
export class EventoEditComponent implements OnInit {

  titulo = 'Edição de evento';
  registerForm = {} as FormGroup;
  evento = {} as Evento;
  imagemURL = 'assets/img/upload.png';
  dataEvento = '';
  file = {} as File;
  fileNameToUpdate = '';

  dataAtual = '';


  get lotes(): FormArray {
    return <FormArray>this.registerForm.get('lotes');
  }

  get redesSociais(): FormArray {
    return <FormArray>this.registerForm.get('redesSociais');
  }

  constructor(private eventoService: EventoService
    // tslint:disable-next-line: align
    , private router: ActivatedRoute
    // tslint:disable-next-line: align
    , private fb: FormBuilder
    // tslint:disable-next-line: align
    , private localService: BsLocaleService
    // tslint:disable-next-line: align
    , private toastr: ToastrService
) {
  this.localService.use('pt-BR');
}

  ngOnInit() {
    this.validation();
    this.carregarEvento();
  }

  carregarEvento(){
    const idEvento = this.router.snapshot.params.id;
    this.eventoService.getEventoByID(idEvento).subscribe(
      (evento: Evento) => {
        this.evento = Object.assign({}, evento);
        this.fileNameToUpdate = evento.imagemURL.toString();

        this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;

        this.evento.imagemURL = '';
        this.registerForm.patchValue(this.evento);
        
        this.evento.lotes.forEach(lote => {
          this.lotes.push(this.criaLotes(lote));
        })

        this.evento.redeSociais.forEach(redeSocial => {
          this.redesSociais.push(this.criaRedeSociais(redeSocial));
        })


      },
      (error) => {
        this.toastr.error(error);
      }
    );
  }

  onFileChange(evento: any) {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = evento.target.files;
    reader.readAsDataURL(evento.target.files[0]);
  }

  validation() {
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(200)]],
      local: ['', [Validators.required, Validators.maxLength(150)]],
      dataEvento: ['', Validators.required],
      imagemURL: ['',  Validators.maxLength(2000)],
      qtdPessoas: ['', [Validators.required, Validators.max(120000), Validators.min(3)]],
      telefone: ['', [Validators.required,  Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(300)]],
      lotes: this.fb.array([]),
      redesSociais: this.fb.array([])
    });
  }

  criaLotes(lote: any) : FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
      quantidade: [lote.quantidade, Validators.required],
    });
  }

  adicionarLotes() {
    this.lotes.push(this.criaLotes({ id: 0}));
  }

  adicionarRedesSocial() {
    this.redesSociais.push(this.criaRedeSociais({ id: 0}));
  }

  removerLote(id: number) {
    this.lotes.removeAt(id);
  }

  removerRedeSocial(id: number) {
    this.redesSociais.removeAt(id);
  }

  criaRedeSociais(redeSocial: any) : FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required], 
      url: [redeSocial.url, Validators.required], 
    });
  }

}
