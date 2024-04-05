import { Component, OnInit } from '@angular/core';
import { Product } from 'app/model/product';
//import data from '../../assets/products.json';
import { MessageService, SelectItem, ConfirmationService } from 'primeng/api';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AdminProductComponent implements OnInit {
  error: any;
  responseHttp: any;
  productDialog: boolean = false;

  products!: Product[];

  product!: Product;

  selectedProducts!: Product[] | null;

  submitted: boolean = false;

  statuses!: any[];


  constructor(private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.getProducts()
    this.statuses = [
        { label: 'INSTOCK', value: 'instock' },
        { label: 'LOWSTOCK', value: 'lowstock' },
        { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];
}

getProducts(){
    this.productService.getProductsDataFromBdd()
    .subscribe(response => {
      this.products = response.data;
    });
}

openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
}

deleteSelectedProducts() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected products?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            //this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
            this.selectedProducts.forEach(product => {
                this.productService.deleteProduct(product.id)
                .subscribe(response => {
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
                this.getProducts()
                });
            });
            this.selectedProducts = null; 
        }
    });
}

editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
}

deleteProduct(product: Product) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + product.name + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.productService.deleteProduct(product.id)
            .subscribe(response => {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
              this.getProducts()
            });
            this.product = {};
            
        }
    });
}

hideDialog() {
    this.productDialog = false;
    this.submitted = false;
}

saveProduct() {
    this.submitted = true;

    if (this.product.name?.trim()) {
        if (this.product.id) {
            this.productService.editProduct(this.product)
            .subscribe(response => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
            this.getProducts();
            this.productDialog = false;
            });
        } else {
            this.product.code = this.createCode()
            this.productService.addProduct(this.product)
            .subscribe(response => {
                // console.log(response)
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
              this.getProducts();
            });
            
        }
        this.product = {};
        this.productDialog = false;
    }
}

findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === Number(id)) {
            index = i;
            break;
        }
    }

    return index;
}

createCode(): string {
    let id = '';
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 9; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

getSeverity(status: string) {
    switch (status) {
        case 'INSTOCK':
            return 'success';
        case 'LOWSTOCK':
            return 'warning';
        case 'OUTOFSTOCK':
            return 'danger';
    }
}

}
