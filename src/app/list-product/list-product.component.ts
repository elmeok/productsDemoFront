import { Component, OnInit } from '@angular/core';
// import data from '../../assets/products.json';
import { Product } from 'app/model/product';
import { SelectItem } from 'primeng/api';
import { ProductService } from '../../service/product.service';


@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {
  layout: string = 'list';
  products!: Product[];
  sortOptions!: SelectItem[];
  sortOrder!: number;
  sortField!: string;
  originalProducts!: Product[];
  
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts()
    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' },
      { label: 'Name', value: 'name' }
    ];
  }

  getProducts(){
    this.productService.getProductsDataFromBdd()
    .subscribe(response => {
      this.products = response.data;
      this.originalProducts = response.data;
    });
}

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    } else {
        this.sortOrder = 1;
        this.sortField = value;
    }
}
  applyFilter(event:any){
    this.products = this.originalProducts;
    this.products = this.products.filter((product)=> product.name.toLowerCase().includes(event.target.value.toLowerCase()))
  }

  getSeverity(product: Product) {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};

}
