import { Component, OnInit } from '@angular/core';
import { deleteObject, getDownloadURL, percentage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDiscountResponse } from 'src/app/shared/interfaces/discount.interface';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';
import { Storage } from '@angular/fire/storage';

@Component({
  selector: 'app-admin-discount',
  templateUrl: './admin-discount.component.html',
  styleUrls: ['./admin-discount.component.scss']
})
export class AdminDiscountComponent implements OnInit {

  public adminDiscounts: Array<IDiscountResponse> = []

  constructor(
    private discountService: DiscountService,
    private fb: FormBuilder,
    public storage: Storage
  ) { }
  public discountForm!: FormGroup

  ngOnInit(): void {
    this.getDiscounts();
    this.initDiscountForm()
  }

  public description!: string;
  public imagePath = 'https://la.ua/wp-content/uploads/2021/08/6-1.jpg';
  public editStatus = false;
  public editID!: number;
  public currentDiscountId!: number
  public uploadPercent: number = 0
  public isUploaded = false

  getDiscounts(): void {
    this.discountService.getAll().subscribe(data => {
      this.adminDiscounts = data;
    })
  }
  
  initDiscountForm() {
    this.discountForm = this.fb.group({
      description: [null, Validators.required],
      imagePath: [null]
    })
  }

  addDiscount(): void {
    if (this.editStatus) {
      this.discountService.update(this.discountForm.value, this.currentDiscountId).subscribe(() => {
        this.getDiscounts()
      })
    } else {
      this.discountService.create(this.discountForm.value).subscribe(() => {
        this.getDiscounts()
      })
    }
    this.editStatus = false
    this.discountForm.reset()
    this.isUploaded = false
  }

  editDiscount(discount: IDiscountResponse): void {
    this.discountForm.patchValue({
      description: discount.description,
      ImagePath: discount.imagePath
    })
    this.editStatus = true
    this.currentDiscountId = discount.id
  }

  deleteDiscount(discount: IDiscountResponse): void {
    this.discountService.delete(discount.id).subscribe(() => {
      this.getDiscounts()
    })
  }

  upload(event: any): void {
    const file = event.target.files[0]
    this.uploadFile('images', file.name, file)
      .then(data => {
        this.discountForm.patchValue({
          imagePath: data
        })
        this.isUploaded = true
      })
      .catch(err => {
        console.log(err)
      })
  }
  
  async uploadFile(folder: string, name: string, file: File | null): Promise<string> {
    const path = `${folder}/${name}`
    let url = ''
    if (file) {
      try {
        const storageRef = ref(this.storage, path)
        const task = uploadBytesResumable(storageRef, file)
        percentage(task).subscribe(data => {
          this.uploadPercent = data.progress
        })
        await task;
        url = await getDownloadURL(storageRef)
      }
      catch (e: any) {
        console.error(e)
      }
    } else {
      console.log('Wrong format')
    }
    return Promise.resolve(url)
  }

  valueByControl(control: string): string {
    return this.discountForm.get(control)?.value
  }

  deleteImage(): void {
    const task = ref(this.storage, this.valueByControl('imagePath'))
    deleteObject(task).then(() => {
      console.log('File deleted')
      this.uploadPercent = 0
      this.isUploaded = false
      this.discountForm.patchValue({
        imagePath: null
      })
    })
  }

}
