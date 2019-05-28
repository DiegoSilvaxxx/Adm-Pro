import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Prato} from '../model/prato';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-prato-view',
  templateUrl: './prato-view.page.html',
  styleUrls: ['./prato-view.page.scss'],
})
export class PratoViewPage implements OnInit {

  prato : Prato = new Prato();
  id : string;
  firestore = firebase.firestore();
  settings = {timestampsInSnapshots: true};

  formGroup : FormGroup; // <----
  

  constructor(public  activatedRoute: ActivatedRoute, 
    public formBuilder : FormBuilder,
    public router : Router,
    public nav : NavController) {// <----
      this.id = this.activatedRoute.snapshot.paramMap.get('prato');
      this.form(); // <----
  }

  form(){// <----
    this.formGroup = this.formBuilder.group({
      nome : [this.prato.nome],
      descricao : [this.prato.descricao],
      valor : [this.prato.valor],
    });
  }

  ngOnInit() {
    this.obterPrato();
  }

  obterPrato(){
    var ref = firebase.firestore().collection("prato").doc(this.id);
  
    ref.get().then(doc => {
        this.prato.setDados(doc.data());
        this.form();
        
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    
  }

  atualizar(){
    let ref = this.firestore.collection('prato')
    ref.doc(this.id).set(this.formGroup.value)
      .then(() =>{
        console.log('Atualizado com sucesso');
        this.nav.navigateRoot('/lista-de-pratos');
      }).catch(()=>{
        console.log('Erro ao Atualizar');
      })
  }

}