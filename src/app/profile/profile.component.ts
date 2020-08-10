import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import { User } from '../entities/user';

import { Observable } from 'rxjs/Rx';
import { FileUploadService } from '../services/file-upload.service';
import { Adresse } from "../shared/adresse";
import { HttpEventType, HttpResponse } from "@angular/common/http";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  loading = false;
  userObservable: Observable<User>; 
  user: User;
  ipAdress: string = Adresse.ip;
  progress: { percentage: number } = { percentage: 0 };
  selectedValue = 1;
  titles: string[] = ['Student', 'Interne', 'Résident', 'Généraliste',
    'Spécialiste', 'Professeur', 'Assistant', 'Prof. Agrégé'];
  affiliations: string[] = ['Private Cabinet', 'Hospital', 'CHU', 'Clinic', 'Center'];
  specialitytitles: string[] = ['Médecine Générale', 'spécialités médicales', 'spécialités chirurgicales',
    'Biologie et disciplines fondamentales', 'Spécialités médico-militaires', 'Autres Professions de Santé'];
  // model: any = {};
  speciality1: string[] = ['Médecin Généraliste', 'Médecin Généraliste /Acupuncture', 'Médecin Généraliste /Allergologie',
    'Médecin Généraliste /Angiologie', 'Médecin Généraliste /Gériatrie', 'Médecin Généraliste /Handicap et réhabilitation des handicapés',
    'Médecin Généraliste /Hémodialyse', 'Médecin Généraliste /Hygiène hospitalière', 'Médecin Généraliste /Maladies professionnelles',
    'Médecin Généraliste /Médecine aéronautique', 'Médecin Généraliste /Médecine appliquée au sport',
    'Médecin Généraliste /Médecine subaquatique et hyperbare', 'Médecin Généraliste /Phytothérapie',
     'Médecin Généraliste /Prise en charge des urgences',
    'Médecin Généraliste /Réparation juridique du dommage corporel',
     'Médecin Généraliste /Santé publique', 'Médecin Généraliste /Sexologie',
    'Médecin Généraliste /Toxicologie'];

  speciality2: string[] = ['Anatomie et cytologie pathologique', 'Anesthésie – réanimation', 'Carcinologie médicale',
    'Cardiologie', 'Dermatologie', 'Endocrinologie', 'Gastro-entérologie', 'Hématologie clinique', 'Imagerie médicale',
    'Maladies infectieuses', 'Médecine d\'urgence', 'Médecine du travail', 'Médecine interne', 'Médecine légale',
    'Médecine physique, rééducation et réadaptation fonctionnelle', 'Médecine préventive et communautaire',
    'Néphrologie', 'Nutrition et maladies nutritionnelles', 'Pédiatrie', 'Pédopsychiatrie',
    'Pneumologie', 'Psychiatrie', 'Radiothérapie carcinologique', 'Réanimation médicale', 'Rhumatologie'];

  speciality3: string[] = ['Chirurgie carcinologique', 'Chirurgie cardio-vasculaire', 'Chirurgie générale', 'Chirurgie neurologique',
    'Chirurgie plastique, réparatrice et esthétique', 'Chirurgie orthopédique et traumatologique', 'Chirurgie pédiatrique',
    'Chirurgie thoracique', 'Chirurgie urologique', 'Chirurgie vasculaire périphérique', 'Gynécologie-obstétrique',
    'O.R.L', 'Ophtalmologie', 'Stomatologie et chirurgie maxillo-faciale'];

  speciality4: string[] = ['Anatomie', 'Biologie médicale', 'Biologie médicale (option : biochimie)',
   'Biologie médicale (option : microbiologie)   ',
    'Biologie médicale (option : parasitologie)', 'Biologie médicale (option: hématologie)', 'Génétique', 'Histo-embryologie',
    'Pharmacologie', 'Physiologie et exploration fonctionnelle'];

  speciality5: string[] = ['Direction et logistique médico-militaire', 'Hygiène nucléaire', 'Médecine aéronautique et spatiale',
    'Médecine de la plongée sous-marine'];

  speciality6: string[] = ['Dentiste', 'Infirmier(e)', 'Pharmacien(ne)', 'Sage-femme', 'Kinésithérapeute', 'Ergothérapeute',
    'Podologue', 'Autre Professionnel de Santé', 'Presse', 'Industriel de santé'];

  constructor(private userService: UserService, private fileUploadService: FileUploadService) { }

  ngOnInit() {
   
    this.userObservable = this.userService.getInfo();
    this.userObservable.subscribe(
      data => {
        this.user = data;
        this.loading = false;
        if (data.specialityTitle === 'Médecine Générale') {
          this.selectedValue = 1;
        } else if (data.specialityTitle === 'spécialités médicales') {
          this.selectedValue = 2;
        } else if (data.specialityTitle === 'spécialités chirurgicales') {
          this.selectedValue = 3;
        } else if (data.specialityTitle === 'Biologie et disciplines fondamentales') {
          this.selectedValue = 4;
        } else if (data.specialityTitle === 'Spécialités médico-militaires') {
          this.selectedValue = 5;
        } else if (data.specialityTitle === 'Autres Professions de Santé') {
          this.selectedValue = 6;
        }
      }
    );
    this.loading = true;    
  }

  public getInfos() {
    this.userService.getInfo();
  }

  public updateInfo() {
    console.log('user ' + this.user);
    this.userService.updateUser(this.user).subscribe(
      data => {
        this.user = <User> data;
      }
    );
  }
  change(newValue) {
    console.log('vvv  ' + newValue);
    if (newValue === 'Médecine Générale') {
      this.selectedValue = 1;
    } else if (newValue === 'spécialités médicales') {
      this.selectedValue = 2;
    } else if (newValue === 'spécialités chirurgicales') {
      this.selectedValue = 3;
    } else if (newValue === 'Biologie et disciplines fondamentales') {
      this.selectedValue = 4;
    } else if (newValue === 'Spécialités médico-militaires') {
      this.selectedValue = 5;
    } else if (newValue === 'Autres Professions de Santé') {
      this.selectedValue = 6;
    }
  }

  getSpeciality(): string[] {
    if (this.selectedValue === 1) {
      return this.speciality1;
    } else if (this.selectedValue === 2) {
      return this.speciality2;
    } else if (this.selectedValue === 3) {
      return this.speciality3;
    } else if (this.selectedValue === 4) {
      return this.speciality4;
    } else if (this.selectedValue === 5) {
      return this.speciality5;
    } else if (this.selectedValue === 6) {
      return this.speciality6;
    }
  }

  upload(place: string, file: File, filename: string) {
    this.progress.percentage = 0;

    this.fileUploadService.pushFileToStorage(file, place, filename).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
        console.log(this.progress.percentage);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
      } 
    },
    error => {
      console.log('file upload failed');
    }  
  );

    // this.selectedFiles = undefined
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function () {
        $('#photo')
          .attr('src', reader.result);
        $('#photo2')
          .attr('src', reader.result);
      };
      reader.readAsDataURL(fileInput.target.files[0]);
      const filename = 'profile_' + new Date().getTime() + '.png';

      this.upload('photos', fileInput.target.files[0], filename);
      this.user.photo = this.ipAdress + '/files/photos/' + filename;
    }
  }
}
