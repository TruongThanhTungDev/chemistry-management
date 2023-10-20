import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';
import { NotificationService } from "src/app/shared/utils/toast.service";
@Component({
  selector: 'basic-infomation-chemistry',
  templateUrl: './basic-infomation-chemistry.component.html',
  styleUrls: ['./basic-infomation-chemistry.component.scss'],
})
export class BasicInformationChemistry {
  basicInformation: FormGroup;
  chemiscalTypeName: any;
  image: any;
  constructor(
    private formBuilder: FormBuilder,
    private notify: NotificationService
  ) {
    this.basicInformation = this.formBuilder.group({
      code: [''],
      name: ['', [Validators.required]],
      formula: ['', [Validators.required]],
      chemiscalType: ['', [Validators.required]],
      nomenclature: ['', [Validators.required]],
      expirationDate: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      storageStatus: [true],
      usingStatus: [true],
      image: [''],
      barcode: [''],
    });
  }
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
    this.basicInformation.patchValue({
      image: reader.result,
    });
  }
  validateForm() {
    if (this.basicInformation && this.basicInformation.invalid) {
      Object.values(this.basicInformation.controls).forEach((control: any) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return false;
    } else {
      return true;
    }
  }
}