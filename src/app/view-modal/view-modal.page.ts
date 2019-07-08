import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Modal } from '../model/modal';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-view-modal',
  templateUrl: './view-modal.page.html',
  styleUrls: ['./view-modal.page.scss'],
})
export class ViewModalPage implements OnInit {

  modal: Modal = new Modal();
  id: string;
  firestore = firebase.firestore();
  settings = { timestampsInSnapshots: true };
  imagem;
  formGroup: FormGroup; // <----


  constructor(public activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    public router: Router,
    public nav: NavController) {// <----
    this.id = this.activatedRoute.snapshot.paramMap.get('modal');
    console.log(this.id)
    this.form(); // <----
  }

  form() {// <----
    this.formGroup = this.formBuilder.group({
      nome: [this.modal.nome],
      descricao: [this.modal.descricao],
      valor: [this.modal.valor],
    });
  }

  ngOnInit() {
    this.downloadFoto();
    this.obterModal();
  }

  obterModal() {
    var ref = firebase.firestore().collection("modal").doc(this.id);

    ref.get().then(doc => {
      this.modal.setDados(doc.data());
      this.form();

    }).catch(function (error) {
      console.log("Error getting document:", error);
    });

  }

  atualizar() {
    let ref = this.firestore.collection('modal')
    ref.doc(this.id).set(this.formGroup.value)
      .then(() => {
        console.log('Atualizado com sucesso');
        this.nav.navigateRoot('/lista-de-pratos');
      }).catch(() => {
        console.log('Erro ao Atualizar');
      })
  }

  enviaArquivo(event) {
    let imagem = event.srcElement.files[0];
    console.log(imagem.name);
    let ref = firebase.storage().ref()
      .child(`promo/${this.id}.jpg`);

    ref.put(imagem).then(url => {
      console.log("Enviado com sucesso!");
      this.downloadFoto();
    })

  }

  downloadFoto() {
    let ref = firebase.storage().ref()
      .child(`promo/${this.modal.id}.jpg`);

    ref.getDownloadURL().then(url => {
      this.imagem = url;
    })
  }





}
