import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'other-information-chemistry',
  templateUrl: './other-information-chemistry.component.html',
  styleUrls: ['./other-information-chemistry.component.scss'],
})
export class OtherInformationChemistry implements OnInit, AfterViewInit {
  otherInfo = {
    physicalProperties: '',
    numberOfMoles: '',
    chemicalProperties: '',
    bondStructure: '',
    naturalStatus: '',
  };
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '179px',
    minHeight: '0',
    maxHeight: '179px',
    width: 'auto',
    minWidth: '0',
    outline: false,
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Nhập tính chất vật lý...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
  };
  infoUser: any;
  constructor() {
    this.infoUser = JSON.parse(localStorage.getItem('infoUser') as any);
  }
  get isAdmin() {
    return this.infoUser && this.infoUser.role === 'admin'
  }
  ngOnInit(): void {}
  ngAfterViewInit(): void {}
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    }
  }
  _handleReaderLoaded(e: any) {
    const reader = e.target;
    this.otherInfo.bondStructure = reader.result;
  }
}
