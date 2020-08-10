import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { Message } from '../../entities/message';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Fichier } from '../../entities/file';
import { Router } from '@angular/router';
import { FileUploadService } from "../../services/file-upload.service";
import { HttpEventType, HttpResponse } from "@angular/common/http";

declare let jquery: any;
declare let $: any;
declare let dicomParser: any;

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'] 
})
export class SendComponent implements OnInit {
  attaches: File[] = [];
  id: string;
  closeResult: string;
  message: string;
  subject: string;
  success: string;
  error = '';

  progress: { percentage: number } = { percentage: 0 };

  dataSet: any;
  constructor(private route: ActivatedRoute, private messageService: MessageService,
    private modalService: NgbModal, private router: Router, private fileUploadService: FileUploadService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['username'];
      console.log('id ' + this.id);
    });
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

  attach(event: any) {
    if (event.target.files && event.target.files[0]) {
      if (this.attaches === undefined) {
        console.log('undefined');
      } else {
        const file = event.target.files[0];

        ///////////////////////////////////// anonymize
        if (file.name.indexOf('.dcm') !== -1 || file.name.indexOf('.') === -1) {
          const reader = new FileReader();
          reader.onload = (fichier) => {
            const arrayBuffer = reader.result;
            const byteArray = new Uint8Array(arrayBuffer);
            const kb = byteArray.length / 1024;
            const mb = kb / 1024;
            const byteStr = mb > 1 ? mb.toFixed(3) + ' MB' : kb.toFixed(0) + ' KB';
            setTimeout(() => {
              try {
                const start = new Date().getTime();
                this.dataSet = dicomParser.parseDicom(byteArray);
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
                      const element = this.dataSet.elements[attr];
                      const newValue = $(input).val();
                      for (let i = 0; i < element.length; i++) {
                        const char = (newValue.length > i) ? newValue.charCodeAt(i) : 32;
                        console.log(char);
                        this.dataSet.byteArray[element.dataOffset + i] = char;
                      }
                    }
                  }
                });
                const blob = new Blob([this.dataSet.byteArray], { type: 'application/dicom' });
                const fichierblob = this.blobToFile(blob, file.name);
                this.attaches.push(fichierblob);
              } catch (err) {
                $('#status').removeClass('alert-success alert-info alert-warning').addClass('alert-danger');
                document.getElementById('statusText').innerHTML = 'Status: Error - ' + err + ' (file of size ' + byteStr + ' )';
              }
            }, 30);
          };
          reader.readAsArrayBuffer(file);
        } else {
          this.attaches.push(file);
        }
      }
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

    //this.selectedFiles = undefined
  }
  
  send(username: string) {
    this.success = '';
    if ((this.subject !== undefined && this.message !== undefined) || (this.subject !== '' && this.message !== '') ) {
      this.error = '';
      const files: Fichier[] = [];
      for (let i = 0; i < this.attaches.length; i++) {
        const file: Fichier = new Fichier();
        file.filename = this.attaches[i].name;
        file.savedfilename = this.attaches[i].name;
        if (this.attaches[i].name.indexOf('.pdf') !== -1) {
          file.type = 'report';
        } else {
          file.type = 'dicom';
        }
        file.date = new Date() + '';
        files.push(file);
        this.upload(username, this.attaches[i], this.attaches[i].name);
      }
      const message = new Message();
      message.date = new Date() + '';
      message.text = this.message;
      message.title = this.subject;
      message.files = files;

      this.messageService.saveMessage(message, username).subscribe(
        data => {
          this.success = 'message sent';
          this.attaches = [];
          this.message = '';
          this.subject = '';
        }
      );
    } else{
      if(this.subject === undefined) {
        this.error = 'empty subject';
      }

      if(this.message === undefined) {
        this.error = 'empty message';
      }
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
    console.log('unknown VR:' + vr);
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    // A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    // Cast to a File() type
    return <File>theBlob;
  }

}
