import { Component, OnInit } from '@angular/core';
import { IDiscountResponse } from 'src/app/shared/interfaces/discount.interface';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {

  constructor(
    private discounteService: DiscountService
  ) { }

  ngOnInit(): void {
    this.getDiscounts()
  }

  public userDiscounts: Array<IDiscountResponse> = []

  getDiscounts(): void {
    this.discounteService.getAll().subscribe(data => {
      this.userDiscounts = data
    })
  }

}
