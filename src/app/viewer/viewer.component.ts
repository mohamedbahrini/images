import { Component, OnInit } from "@angular/core";

import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

declare var jquery: any;
declare var $: any;
declare var cornerstone: any;
declare var cornerstoneWADOImageLoader: any;
declare var cornerstoneTools: any;

declare let dicomParser: any;

@Component({
  selector: "app-viewer",
  templateUrl: "./viewer.component.html",
  styleUrls: ["./viewer.component.css"]
})
export class ViewerComponent implements OnInit {
  dataSet: any;
  anonymize = true;
  values: string[] = [];
  closeResult: string;
  showButton = false;
  keys: string[] = [
    "name ",
    "id ",
    "birth date ",
    "description ",
    "protocol name ",
    "accession ",
    "study id ",
    "study date ",
    "serie time ",
    "acquisition date ",
    "acquisition time ",
    "content date ",
    "content time "
  ];
  constructor(
    private modalService: NgbModal
  ) {}

  ngOnInit() {}

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  public fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const filename = fileInput.target.files[0].name;
      if (filename.indexOf(".jpg") !== -1 || filename.indexOf(".png") !== -1) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imageBase64 = e.target.result;
          $("#canvas1").css("background", "url(" + imageBase64 + ")");
          $("#canvas1").css("background-repeat", "no-repeat");
          $("#canvas1").css("width", "100%");
          $("#dicomImage").css("height", "0%");
        };
        reader.readAsDataURL(fileInput.target.files[0]);
      } else {
        $("#dicomImage").css("height", "70vh");
        $("#canvas1").css("background", "");
        $("#canvas1").css("background-repeat", "no-repeat");
        $("#canvas1").css("width", "0vh");
        $("#canvas1").css("height", "0vh");
        let loaded = false;
        const file = fileInput.target.files[0];
        const imageId = cornerstoneWADOImageLoader.fileManager.add(file);
        const element = $("#dicomImage").get(0);
        cornerstone.enable(element);
        cornerstone.loadImage(imageId).then(
          image => {
            const viewport = cornerstone.getDefaultViewportForImage(
              element,
              image
            );
            cornerstone.displayImage(element, image, viewport);
            if (loaded === false) {
              // add event handlers to pan image on mouse move
              element.addEventListener("mousedown", ev => {
                let lastX = ev.pageX;
                let lastY = ev.pageY;
                const mouseButton = ev.which;

                function mouseMoveHandler(e) {
                  const deltaX = e.pageX - lastX;
                  const deltaY = e.pageY - lastY;
                  lastX = e.pageX;
                  lastY = e.pageY;

                  if (mouseButton === 1) {
                    viewport.voi.windowWidth += deltaX / viewport.scale;
                    viewport.voi.windowCenter += deltaY / viewport.scale;
                    cornerstone.setViewport(element, viewport);
                  } else if (mouseButton === 2) {
                    viewport.translation.x += deltaX / viewport.scale;
                    viewport.translation.y += deltaY / viewport.scale;
                    cornerstone.setViewport(element, viewport);
                  } else if (mouseButton === 3) {
                    viewport.scale += deltaY / 100;
                    cornerstone.setViewport(element, viewport);
                  }
                }

                function mouseUpHandler() {
                  document.removeEventListener("mouseup", mouseUpHandler);
                  document.removeEventListener("mousemove", mouseMoveHandler);
                }

                document.addEventListener("mousemove", mouseMoveHandler);
                document.addEventListener("mouseup", mouseUpHandler);
              });

              document
                .getElementById("invert")
                .addEventListener("click", function(e) {
                  viewport.invert = !viewport.invert;
                  cornerstone.setViewport(element, viewport);
                });

              document
                .getElementById("interpolation")
                .addEventListener("click", function(e) {
                  viewport.pixelReplication = !viewport.pixelReplication;
                  cornerstone.setViewport(element, viewport);
                });
              document
                .getElementById("hflip")
                .addEventListener("click", function(e) {
                  viewport.hflip = !viewport.hflip;
                  cornerstone.setViewport(element, viewport);
                });
              document
                .getElementById("vflip")
                .addEventListener("click", function(e) {
                  viewport.vflip = !viewport.vflip;
                  cornerstone.setViewport(element, viewport);
                });
              document
                .getElementById("rotate")
                .addEventListener("click", function(e) {
                  viewport.rotation += 90;
                  cornerstone.setViewport(element, viewport);
                });
              /////////////////////////////

              const $section = $("#focal");
              $section.find(".panzoom").panzoom({
                $zoomIn: $("#zoom-in"),
                $zoomOut: $("#zoom-out"),
                $zoomRange: $section.find("#zoom-range"),
                $reset: $("#reset"),
                panOnlyWhenZoomed: true,
                minScale: 1
              });
              const $panzoom = $section.find(".panzoom").panzoom();
              $panzoom.parent().on("mousewheel.focal", function(e) {
                e.preventDefault();
                const delta = e.delta || e.originalEvent.wheelDelta;
                const zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
                $panzoom.panzoom("zoom", zoomOut, {
                  animate: false,
                  focal: e
                });
              });
              ////////////////////////////////
              loaded = true;
            }
          },
          function(err) {
            alert(err);
          }
        );
        //this.anonymize = false;
        this.fileChangeEvent2(fileInput);
      }
    }
  }

  /// anonymizing/// anonymizing/// anonymizing/// anonymizing/// anonymizing/// anonymizing/// anonymizing
  public fileChangeEvent2(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      const reader = new FileReader();
      reader.onload = fichier => {
        const arrayBuffer = reader.result;

        // Here we have the file data as an ArrayBuffer.  dicomParser requires as input a
        // Uint8Array so we create that here
        const byteArray = new Uint8Array(arrayBuffer);

        const kb = byteArray.length / 1024;
        const mb = kb / 1024;
        const byteStr = mb > 1 ? mb.toFixed(3) + " MB" : kb.toFixed(0) + " KB";

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
              $("#status")
                .removeClass("alert-success alert-info alert-danger")
                .addClass("alert-warning");
              $("#statusText").html(
                "Status: Warnings encountered while parsing file (file of size " +
                  byteStr +
                  " parsed in " +
                  time +
                  "ms)"
              );

              this.dataSet.warnings.forEach(warning => {
                $("#warnings").append("<li>" + warning + "</li>");
              });
            } else {
              const pixelData = this.dataSet.elements.x7fe00010;
              if (pixelData) {
                $("#status")
                  .removeClass("alert-warning alert-info alert-danger")
                  .addClass("alert-success");
                $("#statusText").html(
                  "Status: Ready (file of size " +
                    byteStr +
                    " parsed in " +
                    time +
                    "ms)"
                );
              } else {
                $("#status")
                  .removeClass("alert-warning alert-info alert-danger")
                  .addClass("alert-success");
                $("#statusText").html(
                  "Status: Ready - no pixel data found (file of size " +
                    byteStr +
                    " parsed in " +
                    time +
                    "ms)"
                );
              }
            }

            // Create de-identified values for each element
            this.values = [];
            $("input").each((index, input) => {
              const attr = $(input).attr("data-dicom");
              const element = this.dataSet.elements[attr];
              let text = "";
              const vr = $(input).attr("data-vr");
              if (element !== undefined) {
                const str = this.dataSet.string(attr);
                console.log(attr + " : " + str);
                this.values.push(str);
                if (str !== undefined) {
                  text = str;
                }
              }
              const deIdentifiedValue = this.makeDeIdentifiedValue(
                text.length,
                vr
              );
              $(input).val(deIdentifiedValue);
              $(input).prop("readonly", true);
            });

            //console.log("ipipipi $$ " + this.values);
          } catch (err) {
            $("#status")
              .removeClass("alert-success alert-info alert-warning")
              .addClass("alert-danger");
            document.getElementById("statusText").innerHTML =
              "Status: Error - " + err + " (file of size " + byteStr + " )";
          }
          this.showButton = false;
          if (this.anonymize) {
            this.showButton = true;
          }
          this.anonymize = true;
        }, 30);
      };

      reader.readAsArrayBuffer(file);
    }
  }

  open(content) {
    this.modalService.open(content).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  dumpDataSet(dataSet) {
    $("span[data-dicom]").each((index, value) => {
      const attr = $(value).attr("data-dicom");
      const element = dataSet.elements[attr];
      let text = "";
      if (element !== undefined) {
        const str = dataSet.string(attr);
        if (str !== undefined) {
          text = str;
        }
      }
      $(value).text(text);
    });

    $("span[data-dicomUint]").each((index, value) => {
      const attr = $(value).attr("data-dicomUint");
      const element = dataSet.elements[attr];
      let text = "";
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
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  pad(num, size) {
    let s = num + "";
    while (s.length < size) {
      s = "0" + s;
    }
    return s;
  }

  makeDeIdentifiedValue(length, vr) {
    if (vr === "LO" || vr === "SH" || vr === "PN") {
      return this.makeRandomString(length);
    } else if (vr === "DA") {
      const now = new Date();
      return (
        2017 +
        1900 +
        this.pad(now.getMonth() + 1, 2) +
        this.pad(now.getDate(), 2)
      );
    } else if (vr === "TM") {
      const now = new Date();
      return (
        this.pad(now.getHours(), 2) +
        this.pad(now.getMinutes(), 2) +
        this.pad(now.getSeconds(), 2)
      );
    }
  }

  downloadFile() {
    $("input").each((index, input) => {
      if ($(input).val()) {
        // added bahrini
        const attr = $(input).attr("data-dicom");
        const element = this.dataSet.elements[attr];
        const newValue = $(input).val();
        for (let i = 0; i < element.length; i++) {
          const char = newValue.length > i ? newValue.charCodeAt(i) : 32;
          console.log(char);
          this.dataSet.byteArray[element.dataOffset + i] = char;
        }
      }
    });

    const blob = new Blob([this.dataSet.byteArray], {
      type: "application/dicom"
    });
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  }
}
