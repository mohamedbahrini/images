import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../entities/user';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  user: User = new User();
  loading = false;
  error = '';
  redirect = false;

  selectedValue: number = 1;
  titles: string[] = ["Student", "Interne", "Résident", "Généraliste",
    "Spécialiste", "Professeur", "Assistant", "Prof. Agrégé"];
  affiliations: string[] = ["Private Cabinet", "Hospital", "CHU", "Clinic", "Center"];
  specialitytitles: string[] = ["Médecine Générale", "spécialités médicales", "spécialités chirurgicales",
    "Biologie et disciplines fondamentales", "Spécialités médico-militaires", "Autres Professions de Santé"];

  speciality1: string[] = ["Médecin Généraliste", "Médecin Généraliste /Acupuncture", "Médecin Généraliste /Allergologie",
    "Médecin Généraliste /Angiologie", "Médecin Généraliste /Gériatrie", "Médecin Généraliste /Handicap et réhabilitation des handicapés",
    "Médecin Généraliste /Hémodialyse", "Médecin Généraliste /Hygiène hospitalière", "Médecin Généraliste /Maladies professionnelles",
    "Médecin Généraliste /Médecine aéronautique", "Médecin Généraliste /Médecine appliquée au sport",
    "Médecin Généraliste /Médecine subaquatique et hyperbare", "Médecin Généraliste /Phytothérapie", "Médecin Généraliste /Prise en charge des urgences",
    "Médecin Généraliste /Réparation juridique du dommage corporel", "Médecin Généraliste /Santé publique", "Médecin Généraliste /Sexologie",
    "Médecin Généraliste /Toxicologie"];

  speciality2: string[] = ["Anatomie et cytologie pathologique", "Anesthésie – réanimation", "Carcinologie médicale",
    "Cardiologie", "Dermatologie", "Endocrinologie", "Gastro-entérologie", "Hématologie clinique", "Imagerie médicale",
    "Maladies infectieuses", "Médecine d'urgence", "Médecine du travail", "Médecine interne", "Médecine légale",
    "Médecine physique, rééducation et réadaptation fonctionnelle", "Médecine préventive et communautaire",
    "Néphrologie", "Nutrition et maladies nutritionnelles", "Pédiatrie", "Pédopsychiatrie",
    "Pneumologie", "Psychiatrie", "Radiothérapie carcinologique", "Réanimation médicale", "Rhumatologie"];

  speciality3: string[] = ["Chirurgie carcinologique", "Chirurgie cardio-vasculaire", "Chirurgie générale", "Chirurgie neurologique",
    "Chirurgie plastique, réparatrice et esthétique", "Chirurgie orthopédique et traumatologique", "Chirurgie pédiatrique",
    "Chirurgie thoracique", "Chirurgie urologique", "Chirurgie vasculaire périphérique", "Gynécologie-obstétrique",
    "O.R.L", "Ophtalmologie", "Stomatologie et chirurgie maxillo-faciale"];

  speciality4: string[] = ["Anatomie", "Biologie médicale", "Biologie médicale (option : biochimie)", "Biologie médicale (option : microbiologie)   ",
    "Biologie médicale (option : parasitologie)", "Biologie médicale (option: hématologie)", "Génétique", "Histo-embryologie",
    "Pharmacologie", "Physiologie et exploration fonctionnelle"];

  speciality5: string[] = ["Direction et logistique médico-militaire", "Hygiène nucléaire", "Médecine aéronautique et spatiale",
    "Médecine de la plongée sous-marine"];

  speciality6: string[] = ["Dentiste", "Infirmier(e)", "Pharmacien(ne)", "Sage-femme", "Kinésithérapeute", "Ergothérapeute",
    "Podologue", "Autre Professionnel de Santé", "Presse", "Industriel de santé"];

  constructor(private userService: UserService,
    private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }
  public subscription() {
    this.loading = true;
    this.error = '';

    this.userService.subscribtion(this.user).subscribe(
      data => {
        console.log('success 1');
        this.loading = false;
        this.redirect = true;
        const login = this.authenticationService.login(this.user.username, this.user.password);
        login.then(
          active => {
            console.log('here active');
            this.router.navigate(['/profile']);
          },
        ).catch(error => {
          console.log('here error');
          this.loading = false;
          this.error = 'error in authentication';
        });
      },
      error => {
        this.loading = false;
        console.log(error);
        if (error === 409) {
          this.error = 'username already exist';
        }
      }
    );
  }

  change(newValue) {
    console.log('vvv  ' + newValue);
    if (newValue === "Médecine Générale") {
      this.selectedValue = 1;
      console.log('vvv  true 1 ' + newValue);
    } else if (newValue === "spécialités médicales") {
      this.selectedValue = 2;
      console.log('vvv  true 2 ' + newValue);
    } else if (newValue === "spécialités chirurgicales") {
      this.selectedValue = 3;
      console.log('vvv  true 3 ' + newValue);
    } else if (newValue === "Biologie et disciplines fondamentales") {
      this.selectedValue = 4;
      console.log('vvv  true 4 ' + newValue);
    } else if (newValue === "Spécialités médico-militaires") {
      this.selectedValue = 5;
      console.log('vvv  true 5 ' + newValue);
    } else if (newValue === "Autres Professions de Santé") {
      this.selectedValue = 6;
      console.log('vvv  true 6 ' + newValue);
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
}
