import { Component, OnInit } from '@angular/core';
import { CloudService } from '../services/cloud.service';
import { Fichier } from '../entities/file';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../services/file.service';
import { Observable } from 'rxjs/Rx';
import { Post } from '../entities/post';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../entities/user';
import { UserService } from '../services/user.service';
import { Thumb } from '../entities/thumb';
import { ForumService } from '../services/forum.service';
import { FileUploadService } from "../services/file-upload.service";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { Adresse } from "../shared/adresse";

declare let jquery: any;
declare let $: any;
declare let cornerstone: any;
declare let cornerstoneWADOImageLoader: any;
declare let cornerstoneTools: any;

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['./cloud.component.css']
})
export class CloudComponent implements OnInit {
  loading = false;
  ipAdress: string = Adresse.ip;
  files: Fichier[];
  fichier: Fichier;
  closeResult: string;
  containerSize: number;
  description: string;
  user: User;
  file: Fichier;
  selectedImage: string;
  progress: { percentage: number } = { percentage: 0 };
  constructor(private cloudService: CloudService,
    private modalService: NgbModal, private fileUploadService: FileUploadService,
    private fileService: FileService, private userService: UserService,
    private forumService: ForumService) { }

  ngOnInit() {
    this.userService.getInfo().subscribe(
      data => {
        this.user = data;
      }
    );
    this.cloudService.getFiles('dicom').subscribe(
      data => {
        this.loading = false;
        this.files = data;
      }
    );
    this.loading = true;

    /*this.azureService.getContainerSize().subscribe(
      data => {
        this.containerSize = Math.round(Number(data / 1048576));
      }
    );*/
  }

  upload(place: string, file: File, filename: string) {
    this.progress.percentage = 0;

    this.fileUploadService.pushFileToStorage(file, place, filename).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
        console.log(this.progress.percentage);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        this.fileService.addFile(this.fichier).subscribe(
          data => {
            this.files = data;
          }
        );
      } 
    },
    error => {
      console.log('file upload failed');
    }  
  );

    // this.selectedFiles = undefined
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

  public fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const filename = fileInput.target.files[0].name;
      const file = fileInput.target.files[0];
      this.upload('private', fileInput.target.files[0], filename);

      if (filename.indexOf('.jpg') !== -1 || filename.indexOf('.png') !== -1) {

        this.fichier = new Fichier();

        this.fichier.thumb = this.ipAdress + '/files/' + this.user.username+ '/' + file.name;
        this.fichier.date = Date.now() + '';
        this.fichier.filename = file.name;
        this.fichier.savedfilename = file.name;
        this.fichier.type = 'dicom';
        ////////////////// test
        /*Observable.interval(200)
          .takeWhile(() => !this.azureService.finishUpload)
          .subscribe(
          {
            next: val => console.log('perc ' + this.azureService.perc),
            complete: () => {
              this.fileService.addFile(fichier).subscribe(
                data => {
                  this.files = data;
                  this.azureService.getContainerSize().subscribe(
                    data => {
                      this.containerSize = Math.round(Number(data / 1048576));
                    }
                  );
                }
              );
            },
            error: val => console.log(`Error: ${val}`)
          }
          );*/

      } else {
        let loaded = false;
        // this.azureService.uploadBlob(this.username, file);
        const imageId = cornerstoneWADOImageLoader.fileManager.add(file);
        const element = $('#dicomImage').get(0);
        cornerstone.enable(element);
        cornerstone.loadImage(imageId).then((image) => {
          const viewport = cornerstone.getDefaultViewportForImage(element, image);
          cornerstone.displayImage(element, image, viewport);
          if (loaded === false) {
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.mouseWheelInput.enable(element);
            cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
            cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
            cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
            cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel
            loaded = true;
          }

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
          const thumbname = 'thumbs' + Date.now() + '.png';
          urltoFile(imageBase64, thumbname, 'image/png')
            .then((file1) => {
              this.fichier = new Fichier();
              this.upload('thumbs', file1, thumbname);
              this.fichier.thumb = this.ipAdress + '/files/thumbs/' + file1.name;
              this.fichier.date = Date.now() + '';
              this.fichier.filename = file.name;
              this.fichier.savedfilename = file.name;
              this.fichier.type = 'dicom';
              /*Observable.interval(200)
                .takeWhile(() => !this.azureService.finishUpload)
                .subscribe(
                {
                  next: val => console.log('perc ' + this.azureService.perc),
                  complete: () => this.fileService.addFile(fichier).subscribe(
                    data => {
                      this.files = data;
                    }
                  ),
                  error: val => console.log(`Error: ${val}`)
                }
                );*/
            }, function (err) {
              alert(err);
            });
        }, function (err) {
          alert(err);
        });
      }
    }
  }

  public downloadBlob(path: string, filename: string) {
    const lien = this.ipAdress + '/files/' + this.user.username + '/' + path;
    window.open(lien, '_blank');
  }

  public deleteBlob(file: Fichier) {
    /*this.azureService.deleteBlob(this.user.username, file.savedfilename);
    this.cloudService.deleteFiles(file).subscribe(
      data => {
        this.files = data;
        this.loading = false;
        this.azureService.getContainerSize();
      }
    );*/
    this.loading = true;
  }

  public partager() {
    if (this.description !== undefined) {
      const thumb: Thumb = new Thumb();
      thumb.link = this.ipAdress + '/files/' +this.user.username + '/' + this.file.savedfilename;
      thumb.thumb = this.file.thumb;
      if ((this.file.savedfilename.indexOf('.png') !== -1) || (this.file.savedfilename.indexOf('.jpg') !== -1)) {
        thumb.type = 'normal';
      } else {
        thumb.type = 'dicom';
      }
      const thumbs: Thumb[] = [];
      thumbs.push(thumb);

      const post: Post = new Post();
      post.date = new Date() + '';
      post.text = this.description;
      post.profilephoto = this.user.photo;
      post.thumbs = thumbs;
      post.username = this.user.username;
      this.forumService.savePost(post);
    }
  }
  public setSelected(file: Fichier) {
    this.file = file;
    this.selectedImage = file.thumb;
  }
}
