import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PersonnesHomeComponent} from './personnes-home/personnes-home.component';
import {PersonnesDetailsComponent} from './personnes-details/personnes-details.component';
import {AngularMaterialModule} from '../angular-material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ToastrModule} from 'ngx-toastr';
import {EditPersonneComponent} from './edit-personne/edit-personne.component';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {FormPersonneComponent} from './form-personne/form-personne.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AuteurGuardService} from '../shared/auteur-guard.service';


@NgModule({
  declarations: [PersonnesHomeComponent, PersonnesDetailsComponent, EditPersonneComponent, FormPersonneComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ToastrModule.forRoot(),
    AngularMaterialModule,
    MaterialFileInputModule,
  ],
  providers: [AuteurGuardService]
})
export class PersonnesModule {
}
