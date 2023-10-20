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
    bondStructure: ''
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
  ngOnInit(): void {}
  ngAfterViewInit(): void {}
}
