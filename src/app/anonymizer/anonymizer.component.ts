import { Component, OnInit } from '@angular/core';

declare let jquery: any;
declare let $: any;
declare let dicomParser: any;

@Component({
    selector: 'app-anonymizer',
    templateUrl: './anonymizer.component.html',
    styleUrls: ['./anonymizer.component.css']
})
export class AnonymizerComponent implements OnInit {

    dataSet: any;
    constructor() { }
 
    ngOnInit() {
    }

    public fileChangeEvent(fileInput: any) {
        if (fileInput.target.files && fileInput.target.files[0]) {

            const file = fileInput.target.files[0];
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
                        }else {
                            const pixelData = this.dataSet.elements.x7fe00010;
                            if (pixelData) {
                                $('#status').removeClass('alert-warning alert-info alert-danger').addClass('alert-success');
                                $('#statusText').html('Status: Ready (file of size ' + byteStr + ' parsed in ' + time + 'ms)');
                            }else {
                                $('#status').removeClass('alert-warning alert-info alert-danger').addClass('alert-success');
                                $('#statusText').html('Status: Ready - no pixel data found (file of size ' +
                                byteStr + ' parsed in ' + time + 'ms)');
                            }
                        }

                        // Create de-identified values for each element
                        $('input').each((index, input) => {
                            const attr = $(input).attr('data-dicom');
                            const element = this.dataSet.elements[attr];
                            let text = '';
                            const vr = $(input).attr('data-vr');
                            if (element !== undefined) {
                                const str = this.dataSet.string(attr);
                                if (str !== undefined) {
                                    text = str;
                                }
                            }
                            const deIdentifiedValue = this.makeDeIdentifiedValue(text.length, vr);
                            $(input).val(deIdentifiedValue);
                            $(input).prop('readonly', true);

                        });


                    }catch (err) {
                        $('#status').removeClass('alert-success alert-info alert-warning').addClass('alert-danger');
                        document.getElementById('statusText').innerHTML = 'Status: Error - ' + err + ' (file of size ' + byteStr + ' )';
                    }

                }, 30);
            };

            reader.readAsArrayBuffer(file);
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
                }else if (element.length === 4) {
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
        }else if (vr === 'DA') {
            const now = new Date();
            return 2017 + 1900 + this.pad(now.getMonth() + 1, 2) + this.pad(now.getDate(), 2);
        } else if (vr === 'TM') {
            const now = new Date();
            return this.pad(now.getHours(), 2) + this.pad(now.getMinutes(), 2) + this.pad(now.getSeconds(), 2);
        }
    }

    downloadFile() {
        // iterate through each input field and replace the original value with the de-identified value.
        // Note that the deidentified value must be <= length of the original value - longer values
        // will require resizing the Uint8Array and updating the length of the element and I don't feel
        // like doing that right now :)
        $('input').each((index, input) => {

            if ($(input).val()) {// added bahrini
                const attr = $(input).attr('data-dicom');
                const element = this.dataSet.elements[attr];
                const newValue = $(input).val();
                for (let i = 0; i < element.length; i++) {
                    const char = (newValue.length > i) ? newValue.charCodeAt(i) : 32;
                    console.log(char);
                    this.dataSet.byteArray[element.dataOffset + i] = char;
                }
            }
        });

        const blob = new Blob([this.dataSet.byteArray], { type: 'application/dicom' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        /*window.open(url);
        window.URL.revokeObjectURL(url);*/
    }
}
