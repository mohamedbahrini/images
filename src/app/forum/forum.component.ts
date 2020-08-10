import { Component, OnInit } from '@angular/core';
import { Post } from '../entities/post';
import { ForumService } from '../services/forum.service';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Thumb } from '../entities/thumb';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { User } from '../entities/user';
import { CommentService } from '../services/comment.service';
import { Comment } from '../entities/comment';
import { FileUploadService } from "../services/file-upload.service";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { Adresse } from "../shared/adresse";

declare let jquery: any;
declare let $: any;

declare let cornerstone: any;
declare let cornerstoneWADOImageLoader: any;
declare let cornerstoneTools: any;

declare let dicomParser: any;
@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  loading = false;

  imgtest: string;

  selectedFiles: FileList
  currentFileUpload: File
  progress: { percentage: number } = { percentage: 0 }

  posts: Post[] = [];
  finish = false;
  loaded = false;
  closeResult: string;
  description: string;
  thumbs: Thumb[] = [];
  user: User;
  sharedFilenames: string[] = [];

  dataSet: any;
  ipAddress: string = Adresse.ip;
  selectedValue = 0;

  specialityTitle = 'all';
  speciality = 'all';
  titles: string[] = ['all', 'Student', 'Interne', 'Résident', 'Généraliste',
    'Spécialiste', 'Professeur', 'Assistant', 'Prof. Agrégé'];
  affiliations: string[] = ['all', 'Private Cabinet', 'Hospital', 'CHU', 'Clinic', 'Center'];
  specialitytitles: string[] = ['all', 'Médecine Générale', 'spécialités médicales', 'spécialités chirurgicales',
    'Biologie et disciplines fondamentales', 'Spécialités médico-militaires', 'Autres Professions de Santé'];
  // model: any = {};
  speciality0: string[] = ['all'];
  speciality1: string[] = ['all', 'Médecin Généraliste', 'Médecin Généraliste /Acupuncture', 'Médecin Généraliste /Allergologie',
    'Médecin Généraliste /Angiologie', 'Médecin Généraliste /Gériatrie', 'Médecin Généraliste /Handicap et réhabilitation des handicapés',
    'Médecin Généraliste /Hémodialyse', 'Médecin Généraliste /Hygiène hospitalière', 'Médecin Généraliste /Maladies professionnelles',
    'Médecin Généraliste /Médecine aéronautique', 'Médecin Généraliste /Médecine appliquée au sport',
    'Médecin Généraliste /Médecine subaquatique et hyperbare', 'Médecin Généraliste /Phytothérapie',
     'Médecin Généraliste /Prise en charge des urgences',
    'Médecin Généraliste /Réparation juridique du dommage corporel',
     'Médecin Généraliste /Santé publique', 'Médecin Généraliste /Sexologie',
    'Médecin Généraliste /Toxicologie'];

  speciality2: string[] = ['all', 'Anatomie et cytologie pathologique', 'Anesthésie – réanimation', 'Carcinologie médicale',
    'Cardiologie', 'Dermatologie', 'Endocrinologie', 'Gastro-entérologie', 'Hématologie clinique', 'Imagerie médicale',
    'Maladies infectieuses', 'Médecine d\'urgence', 'Médecine du travail', 'Médecine interne', 'Médecine légale',
    'Médecine physique, rééducation et réadaptation fonctionnelle', 'Médecine préventive et communautaire',
    'Néphrologie', 'Nutrition et maladies nutritionnelles', 'Pédiatrie', 'Pédopsychiatrie',
    'Pneumologie', 'Psychiatrie', 'Radiothérapie carcinologique', 'Réanimation médicale', 'Rhumatologie'];

  speciality3: string[] = ['all', 'Chirurgie carcinologique', 'Chirurgie cardio-vasculaire', 'Chirurgie générale', 'Chirurgie neurologique',
    'Chirurgie plastique, réparatrice et esthétique', 'Chirurgie orthopédique et traumatologique', 'Chirurgie pédiatrique',
    'Chirurgie thoracique', 'Chirurgie urologique', 'Chirurgie vasculaire périphérique', 'Gynécologie-obstétrique',
    'O.R.L', 'Ophtalmologie', 'Stomatologie et chirurgie maxillo-faciale'];

  speciality4: string[] = ['all', 'Anatomie', 'Biologie médicale', 'Biologie médicale (option : biochimie)',
   'Biologie médicale (option : microbiologie)   ',
    'Biologie médicale (option : parasitologie)', 'Biologie médicale (option: hématologie)', 'Génétique', 'Histo-embryologie',
    'Pharmacologie', 'Physiologie et exploration fonctionnelle'];

  speciality5: string[] = ['all', 'Direction et logistique médico-militaire', 'Hygiène nucléaire', 'Médecine aéronautique et spatiale',
    'Médecine de la plongée sous-marine'];

  speciality6: string[] = ['all', 'Dentiste', 'Infirmier(e)', 'Pharmacien(ne)', 'Sage-femme', 'Kinésithérapeute', 'Ergothérapeute',
    'Podologue', 'Autre Professionnel de Santé', 'Presse', 'Industriel de santé'];


  constructor(private forumService: ForumService, private modalService: NgbModal,
    private userService: UserService, private commentService: CommentService, private fileUploadService: FileUploadService) { }

  ngOnInit() {
    this.refresh();
    this.userService.getInfo().subscribe(
      data => {
        this.user = data;
      }
    );
    this.loading = true;
  }

  refresh() {
    this.forumService.getPosts().subscribe(
      data => {
        this.loading = false;
        this.posts = data;
        this.loaded = true;
        this.finish = false;
        setTimeout(
          ()=>{this.posts.forEach(element => {
            this.hidediv('test'+element.posteid);
          });}, 1000
        );        
      }
    );
  }

  getFilteredPosts() {
    console.log('title '+this.specialityTitle+' speciality '+this.speciality);
    this.forumService.getFilteredPosts(this.specialityTitle, this.speciality).subscribe(
      data => {
        this.posts = data;
        setTimeout(
          ()=>{this.posts.forEach(element => {
            this.hidediv('test'+element.posteid);
          });}, 1000
        ); 
      }
    ); 
  }

  getSpeciality(): string[] {
    if (this.selectedValue === 0) {
      return this.speciality0;
    } else if (this.selectedValue === 1) {
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
    } else if (newValue === 'all') {
      this.selectedValue = 0;
    }
  }

  getDate(): Date {
    return new Date();
  }
  togglediv(name: string) {
    $('#' + name).slideToggle();
  }


  addComment(name: string) {
    const commentaire: Comment = new Comment();
    const text = $('#comment' + name).val();
    commentaire.date = this.getDate() + '';
    commentaire.photoprofile = this.user.photo;
    commentaire.username = this.user.username;
    commentaire.text = text;
    this.commentService.addComment(commentaire, name).subscribe(
      data => {
        this.posts = data;
      }
    );
  }

  hidediv(name: string) {
      $('#' + name).hide();
  }
  finir() {
    this.finish = true;
  }


  open(content) { 
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
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

    this.selectedFiles = undefined
  }

  public fileChangeEvent(fileInput: any) {
    const thumb: Thumb = new Thumb();
    if (fileInput.target.files && fileInput.target.files[0]) {
      const filename = fileInput.target.files[0].name;
      this.sharedFilenames.push(filename);
      const file = fileInput.target.files[0];
      if (filename.indexOf('.jpg') !== -1 || filename.indexOf('.png') !== -1 || filename.indexOf('.gif') !== -1) {
        const thumbname = 'post' + Date.now() + '.png';
        this.selectedFiles = fileInput.target.files;
        this.upload('forum', file, thumbname);
        thumb.link = this.ipAddress + '/files/forum/' + file.name;
        thumb.thumb = thumb.link;
        thumb.type = 'normal';
        this.thumbs.push(thumb);
      } else {
        ///////////////////////////////////// anonymize
        const reader = new FileReader();
        reader.onload = (fichier) => {
          const arrayBuffer = reader.result;

          // Here we have the file data as an ArrayBuffer.  dicomParser requires as input a
          // Uint8Array so we create that here
          const byteArray = new Uint8Array(arrayBuffer);

          const kb = byteArray.length / 1024;
          const mb = kb / 1024;
          const byteStr = mb > 1 ? mb.toFixed(3) + ' MB' : kb.toFixed(0) + ' KB';

          // set a short timeout to do the parse so the DOM has time to update itself with the above message
          setTimeout(() => {
            // Invoke the paresDicom function and get back a DataSet object with the contents
            try {
              const start = new Date().getTime();
              this.dataSet = dicomParser.parseDicom(byteArray);
              // Here we call dumpDataSet to update the DOM with the contents of the dataSet
              this.dumpDataSet(this.dataSet);
              const end = new Date().getTime();
              const time = end - start;
              if (this.dataSet.warnings.length > 0) {
                $('#status').removeClass('alert-success alert-info alert-danger').addClass('alert-warning');
                $('#statusText').html('Status: Warnings encountered while parsing file (file of size ' +
                  byteStr + ' parsed in ' + time + 'ms)');

                this.dataSet.warnings.forEach(function (warning) {
                  $('#warnings').append('<li>' + warning + '</li>');
                });
              } else {
                const pixelData = this.dataSet.elements.x7fe00010;
                if (pixelData) {
                  $('#status').removeClass('alert-warning alert-info alert-danger').addClass('alert-success');
                  $('#statusText').html('Status: Ready (file of size ' + byteStr + ' parsed in ' + time + 'ms)');
                } else {
                  $('#status').removeClass('alert-warning alert-info alert-danger').addClass('alert-success');
                  $('#statusText').html('Status: Ready - no pixel data found (file of size ' + byteStr + ' parsed in ' + time + 'ms)');
                }
              }

              // Create de-identified values for each element
              $('input').each((index, input) => {
                const attr = $(input).attr('data-dicom');
                if (attr !== undefined) {
                  const elem = this.dataSet.elements[attr];
                  let text = '';
                  const vr = $(input).attr('data-vr');
                  if (elem !== undefined) {
                    const str = this.dataSet.string(attr);
                    if (str !== undefined) {
                      text = str;
                    }
                  }
                  const deIdentifiedValue = this.makeDeIdentifiedValue(text.length, vr);
                  $(input).val(deIdentifiedValue);
                }
                // $(input).prop('readonly', true);

              });

              $('input').each((index, input) => {

                if ($(input).val()) {
                  const attr = $(input).attr('data-dicom');
                  if (attr !== undefined) {
                    const elem = this.dataSet.elements[attr];
                    const newValue = $(input).val();
                    for (let i = 0; i < elem.length; i++) {
                      const char = (newValue.length > i) ? newValue.charCodeAt(i) : 32;
                      this.dataSet.byteArray[elem.dataOffset + i] = char;
                    }
                  }
                }
              });

              const blob = new Blob([this.dataSet.byteArray], { type: 'application/dicom' });

              const dicomname = 'image_' + Date.now() + '.dcm';
              const fichierblob = this.blobToFile(blob, dicomname);
              this.upload('publicdicom', fichierblob, dicomname);
              thumb.link = this.ipAddress + '/files/publicdicom/' + fichierblob.name;


            } catch (err) {
              console.log('erreur123  ' + err);
            }

          }, 30);
        };

        reader.readAsArrayBuffer(file);

        ///////////////////////////// anonymize
        const imageId = cornerstoneWADOImageLoader.fileManager.add(file);
        const element = $('#dicomImage').get(0);
        cornerstone.enable(element);
        cornerstone.loadImage(imageId).then((image) => {
          const viewport = cornerstone.getDefaultViewportForImage(element, image);
          cornerstone.displayImage(element, image, viewport);
          //// create thumb and upload it
          const canvas = $(element).find('canvas').get(0) as HTMLCanvasElement;
          const imageBase64 = canvas.toDataURL();
          const blob1 = new Blob([imageBase64], { type: 'image/png' });

          // return a promise that resolves with a File instance
          function urltoFile(url, filename1, mimeType) {
            mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1];
            return (fetch(url)
              .then(function (res) { return res.arrayBuffer(); })
              .then(function (buf) { return new File([buf], filename1, { type: mimeType }); })
            );
          }
          // Usage example:
          const thumbname = 'post' + Date.now() + '.png';
          urltoFile(imageBase64, thumbname, 'image/png')
            .then((file1) => {
              this.upload('forum', file1, thumbname);
              thumb.thumb = this.ipAddress + '/files/forum/' + file1.name;
              thumb.type = 'normal';
              this.thumbs.push(thumb);
              ////////////////// test
              /*Observable.interval(1000)
                .takeWhile(() => !this.azureService.finishUpload)
                .subscribe(
                {
                  next: val => console.log('perc '),
                  complete: () => { },
                  error: val => console.log(`Error: ${val}`)
                }
                );*/

            }, function (err) {
              alert(err);
            });

          ////
        }, function (err) {
          alert(err);
        });
      }
    }
  }

  public postuler() {
    if (this.description !== undefined && this.thumbs !== undefined) {
      const post: Post = new Post();
      post.date = new Date() + '';
      post.text = this.description;
      post.profilephoto = this.user.photo;
      post.thumbs = this.thumbs;
      post.username = this.user.username;
      this.forumService.savePost(post).subscribe(
        data => {
          this.loading = false;
          this.posts = data;
          this.loaded = true;
          this.finish = false;
          setTimeout(
            ()=>{this.posts.forEach(element => {
              this.hidediv('test'+element.posteid);
            });}, 1000
          ); 
        }
      );
      this.description = '';
      this.thumbs = [];
    }
  }


  dumpDataSet(dataSet) {
    $('span[data-dicom]').each(function (index, value) {
      const attr = $(value).attr('data-dicom');
      const element = dataSet.elements[attr];
      let text = '';
      if (element !== undefined) {
        const str = dataSet.string(attr);
        if (str !== undefined) {
          text = str;
        }
      }
      $(value).text(text);
    });

    $('span[data-dicomUint]').each(function (index, value) {
      const attr = $(value).attr('data-dicomUint');
      const element = dataSet.elements[attr];
      let text = '';
      if (element !== undefined) {
        if (element.length === 2) {
          text += dataSet.uint16(attr);
        } else if (element.length === 4) {
          text += dataSet.uint32(attr);
        }
      }

      $(value).text(text);
    });

  }

  makeRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  pad(num, size) {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }


  makeDeIdentifiedValue(length, vr) {
    if (vr === 'LO' || vr === 'SH' || vr === 'PN') {
      return this.makeRandomString(length);
    } else if (vr === 'DA') {
      const now = new Date();
      return 2017 + 1900 + this.pad(now.getMonth() + 1, 2) + this.pad(now.getDate(), 2);
    } else if (vr === 'TM') {
      const now = new Date();
      return this.pad(now.getHours(), 2) + this.pad(now.getMinutes(), 2) + this.pad(now.getSeconds(), 2);
    }
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    // A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    // Cast to a File() type
    return <File>theBlob;
  }

  download(link: string) {
    window.open(link, '_blank');
  }
}
