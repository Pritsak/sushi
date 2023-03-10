import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryResponse } from 'src/app/shared/interfaces/category.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { ImageService } from 'src/app/shared/services/image/image.service';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.initCategoryForm()
    this.loadCategories()
  }


  public adminCategories: Array<ICategoryResponse> = []
    public editStatus: boolean = false
    public categoryForm!: FormGroup
    public currentCategoryId = 0
    public uploadPercent: number = 0
    public isUploaded = false

  initCategoryForm() {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      path: [null, Validators.required],
      imagePath: [null]
    })
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(data => {
      this.adminCategories = data
    })
  }


  addCategory(): void {
    if (this.editStatus) {
      this.categoryService.update(this.categoryForm.value, this.currentCategoryId).subscribe(() => {
        this.loadCategories()
      })
    } else {
      this.categoryService.create(this.categoryForm.value).subscribe(() => {
        this.loadCategories()
      })
    }
    this.editStatus = false
    this.categoryForm.reset() 
    this.isUploaded = false
    this.uploadPercent = 0
  }
 
   editCategory(category: ICategoryResponse): void {
    this.categoryForm.patchValue({
      name: category.name,
      path: category.path,
      ImagePath: category.imagePath
    })
    this.editStatus = true
    this.currentCategoryId = category.id
  }

  deleteCategory(category: ICategoryResponse): void {
    this.categoryService.delete(category.id).subscribe(() => {
      this.loadCategories()
    })
  }

  upload(event: any): void {
    const file = event.target.files[0]
    this.imageService.uploadFile('images', file.name, file)
      .then(data => {
        this.categoryForm.patchValue({
          imagePath: data
        })
        this.isUploaded = true
      })
      .catch(err => {
        console.log(err)
      })
  }

  valueByControl(control: string): string {
    return this.categoryForm.get(control)?.value
  }

  deleteImage(): void {
    this.imageService.deleteUploadFile(this.valueByControl('imagePath'))
    .then(() => {
      console.log('File deleted')
      this.isUploaded = false
      this.uploadPercent = 0
      this.categoryForm.patchValue({ imagePath: null })
    })
    .catch(err => {
      console.log(err)
    })
  }
}
