import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/_models/Evento';
import { EventoService } from 'src/app/_services/Evento.service';
import { TabsModule } from 'ngx-bootstrap/tabs';

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

  ngOnInit() {
    this.validation();
  }


  onFileChange(file: FileList) {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    reader.readAsDataURL(file[0]);

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
      lotes: this.fb.group({
        nome:   ['', Validators.required],
        preco: ['', Validators.required],
        dataInicio:  [''],
        dataFim:  [''],
        quantidade:  ['', Validators.required],
      }),
      redesSociais: this.fb.group({
        nome: ['', Validators.required], 
        url: ['', Validators.required], 
      })
    });
  }

}
