import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PersonnesService} from '../personnes.service';
import {FileInput, FileValidator} from 'ngx-material-file-input';
import {Personne} from '../../models/personne.model';
import {AuthService} from '../../shared/auth.service';
import {PersonneValidators} from '../personne.validators';
import {gameN} from '../../game/gameN';

@Component({
  selector: 'app-form-personne',
  templateUrl: './form-personne.component.html',
  styleUrls: ['./form-personne.component.css']
})
export class FormPersonneComponent implements OnInit {
  @Input() currentUser: Personne;
  @Input() personne: Personne;
  @Output() updatedPersonne: EventEmitter<{ personne: Personne, avatar: FileInput, pwd: string }>;
  aAccept = '.png, .jpg, .jpeg';
  editForm: FormGroup;
  maxSize = 30000000;
  error: any;
  pageTitle: string;
  action: string;
  avatarFile: any = undefined;

  constructor(private authService: AuthService, private router: Router, private service: PersonnesService) {
    this.updatedPersonne = new EventEmitter<{ personne: Personne, avatar: FileInput, pwd: string }>();
  }


  createForm() {
    this.editForm = new FormGroup({
      nom: new FormControl('', [Validators.required, Validators.minLength(4)]),
      prenom: new FormControl('', [Validators.required, Validators.minLength(4)]),
      cv: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      pwd: new FormGroup({
          password: new FormControl(undefined, [Validators.required, Validators.compose([Validators.minLength(4)])]),
          confirmPassword: new FormControl(undefined, Validators.required)
        }, [PersonneValidators.passwordConfirming]
      ),
      image: new FormControl(null, [FileValidator.maxContentSize(this.maxSize)])
    });
  }

  get accept() {
    return this.aAccept;
  }

  get password() {
    return this.editForm.get('pwd').get('password');
  }

  get confirmPassword() {
    return this.editForm.get('pwd').get('confirmPassword');
  }

  get image() {
    return this.editForm.get('image');
  }

  get nom() {
    return this.editForm.get('nom');
  }

  get prenom() {
    return this.editForm.get('prenom');
  }

  get cv() {
    return this.editForm.get('cv');
  }

  get email() {
    return this.editForm.get('email');
  }

  ngOnInit() {
    if (gameN.isAlive) {
      gameN.game.destroy(true);
    }
    this.createForm();

    const id = this.personne.id;
    if (id === -1) {
      this.pageTitle = 'Enregistrement d\'une personne';
      this.action = 'create';
    } else {
      this.action = 'edit';
      this.pageTitle = 'Edition d\'une personne';
      this.fillForm();
    }

    console.log('Action: ', this.action);

  }

  avatarLocal(file: FileInput) {
    console.log('file : ', file);
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarFile = reader.result;
    };
    reader.readAsDataURL(file.files[0]);
  }

  fillForm() {
    this.editForm.patchValue({
      nom: this.personne.nom,
      prenom: this.personne.prenom,
      cv: this.personne.cv,
      email: this.personne.user.email,
    });
  }

  onSubmit() {
    let pwd;
    let avatar: FileInput;
    this.personne.nom = this.nom.value;
    this.personne.prenom = this.prenom.value;
    this.personne.cv = this.cv.value;
    this.personne.user.email = this.email.value;
    if (this.password.value) {
      pwd = this.password.value;
    }
    if (this.password.value) {
      pwd = this.password.value;
    }
    if (this.image) {
      avatar = this.image.value;
    }
    this.updatedPersonne.emit({
      personne: this.personne,
      avatar,
      pwd
    });
  }
}
