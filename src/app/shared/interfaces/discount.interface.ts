export interface IDiscountRequest {
    description: string,
    imagePath: string
}

export interface IDiscountResponse extends IDiscountRequest {
    id: number
}   