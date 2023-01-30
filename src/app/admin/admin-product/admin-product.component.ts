import { IProductResponse } from 'src/app/shared/interfaces/product/product.interface';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryResponse } from 'src/app/shared/interfaces/category.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { ImageService } from 'src/app/shared/services/image/image.service';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {

  public productForm!: FormGroup
  public adminProduct: Array<IProductResponse> = []
  public adminCategories: Array<ICategoryResponse> = []
  public editStatus = false
  public currentProductId = 0
  public currentCategoryId = 0
  public isOpen = false
  public isUploaded = false

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.loadCategories()
    this.initProductForm()
    this.loadProduct()
  }

  initProductForm(): void {
    this.productForm = this.fb.group({
      category: [[null], Validators.required],
      name: [null, Validators.required],
      path: [null, Validators.required],
      price: [null, Validators.required],
      ingredients: [null, Validators.required],
      weight: [null, Validators.required],
      imagePath: ['https://monosushi.com.ua/wp-content/uploads/2020/11/1.-filadelfiya-z-lososem.jpg.pagespeed.ce.axvTz8qDqj.jpg'],
      count: [1]
    })
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(data => {
      this.adminCategories = data
      this.productForm.patchValue({
        category: this.adminCategories[0].id
      })
    })
  }


  loadProduct(): void {
    this.productService.getAll().subscribe(data => {
      this.adminProduct = data
    })
  }

  addProduct(): void {
    if(this.editStatus) {
      this.productService.update(this.productForm.value, this.currentProductId).subscribe(() => {
        this.loadCategories()
        this.loadProduct()
        this.isUploaded = false
      })
    } else {
      this.productService.create(this.productForm.value).subscribe(() => {
        this.loadCategories()
        this.loadProduct()
      })
    }
    this.isUploaded = false
    this.productForm.reset()
  }

  editProduct(product: IProductResponse): void {
    this.productForm.patchValue({
      category: product.category,
      name: product.name,
      path: product.path,
      ingredients: product.ingredients,
      weight: product.weight,
      price: product.price,
      imagePath: product.imagePath
    })
    this.isOpen = true
    this.isUploaded = true
    this.editStatus = true
    this.currentProductId = product.id
  }

  deleteProduct(product: IProductResponse): void {
    this.productService.delete(product.id).subscribe(() => {
      this.loadProduct()
    })
  }

  deleteImage(): void {
    this.imageService.deleteUploadFile(this.valueByControl('imagePath'))
      .then(() => {
        console.log('File deleted')
        this.productForm.patchValue({ imagePath: null })
      })
      .catch(err => {
        console.log(err)
      })
  }

  upload(event: any): void {
    const file = event.target.files[0]
      this.imageService.uploadFile('images', file.name, file)
        .then(data => {
          console.log('File deleted')
          this.isUploaded = true
          this.productForm.patchValue({
            imagePath: data
          })
        })
        .catch(err => {
          console.log(err)
        })
  }

  toggleOpenForm(): void {
    this.isOpen = !this.isOpen
  }

  valueByControl(control: string): string {
    return this.productForm.get(control)?.value
  }

}


