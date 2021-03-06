import { Injectable } from '@angular/core';
import { Product } from '@app/models/product';
import { ProductAddOn } from '@app/models/product-addon';
import { ProductItem } from '@app/models/product-item';
import { CommonUIService } from '@app/services/common-ui.service';
import { FileStorageService } from '@app/services/firestorage/file-storage.service';
import { ProductService } from '@app/services/firestore/product.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NgxImageCompressService } from 'ngx-image-compress';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { AppState } from '..';
import { productActions } from './product.actions';

@Injectable()
export class ProductEffects{
  private uid: string;
  private shopid: string;
  constructor(
    private store: Store<AppState>,
    private actions: Actions,
    private commonUiService: CommonUIService,
    private productService: ProductService,
    private fileStorageService: FileStorageService,
    private ngxImageCompressService: NgxImageCompressService
  ) {
    this.store.select(state => state.auth.uid).subscribe(uid => this.uid = uid);
    this.store.select(state => state.shop.id).subscribe(
      shopid => this.shopid = shopid
    );
  }

  loadProducts = createEffect(() => this.actions.pipe(
    ofType(productActions.loadProducts),
    switchMap(action => {
      const result = this.productService.query([]);
      return result.pipe()
    }),

    map( arr => {
      return productActions.loadProductsSuccess({products: arr})
    }),

    catchError((error, caught) => {
      this.store.dispatch(productActions.loadProductsFail({error}));
      return caught;
    })
  ));

  createProduct = createEffect(() => this.actions.pipe(
    ofType(productActions.createProduct),
    switchMap(async (action) => {
      const data = <Product>{
        id:'',
        name: action.product.name,
        description: action.product.description,
        price: action.product.price,
        tags: action.product.tags,
        productCategory: action.product.productCategory,
        productItems:[]
      }
      const result = await this.productService.add(data)
      return productActions.createProductSuccess({
        product: result
      })
    }),
    catchError((error, caught) => {
      this.store.dispatch(productActions.createProductFail({error}));
      return caught;
    })
  ));

  createProductSuccess = createEffect(() => this.actions.pipe(
    ofType(productActions.createProductSuccess),
    map((action) => {
      this.commonUiService.notify('New product  created');
    })
  ), { dispatch: false });

  createProductFail = createEffect(() => this.actions.pipe(
    ofType(productActions.createProductFail),
    map((action) => {
      this.commonUiService.notify('Opps. We are aunable to create the product.  Please try again');
    })  
  ), { dispatch: false });

  updateProduct = createEffect(() => this.actions.pipe(
    ofType(productActions.updateProduct),
    //withLatestFrom(this.store),
    debounceTime(500),
    switchMap(async (action, state) => {
     
      const data = <Product>{
        id: action.product.id,
        name: action.product.name,
        description: action.product.description,
        price: action.product.price,
        tags: action.product.tags,
        remarks: action.product.remarks,
        productCategory: action.product.productCategory,
        imageUrl: action.product.imageUrl,
        productItems: action.product.productItems,
      }
      const product = await (this.productService.update(data));

      return productActions.updateProductSuccess({
        update: {
          id: product.id,
          changes: { 
            name: product.name,
            description: product.description,
            price: product.price,
            tags: product.tags,
            imageUrl: product.imageUrl,
            productCategory: product.productCategory,
            remarks: product.remarks
          }
        } 
      })

    }),
    catchError((error, caught) => {
      this.store.dispatch(productActions.updateProductFail({error}));
      return caught;
    })
  ));

  updateProductSuccess = createEffect(() => this.actions.pipe(
    ofType(productActions.updateProductSuccess),
    map((action) => {
      this.commonUiService.notify('Product has been updated.');
    })
  ),{ dispatch: false });

  updateProductFail = createEffect(() => this.actions.pipe(
    ofType(productActions.updateProductFail),
    map((action) => {
      this.commonUiService.notify('Oops. We are aunable to update the product.  Please try again');
      console.log(action.error);
      return null;
    })  
  ),{ dispatch: false });

  upsertProductItem = createEffect(() => this.actions.pipe(
    ofType(productActions.upsertProductItem),
    switchMap(async (action) => {
      const product = await this.productService.get(action.productId);
      let productItems = product.productItems; 
      if (productItems == null) {
        productItems = [];
      }
      const productItem = productItems.find(i => i.itemId == action.productItem.itemId);

      if (productItem != null) {
        Object.assign(productItem, action.productItem);
      } else {
        productItems.push(<ProductItem>{ 
          itemId: action.productItem.itemId, 
          itemName: action.productItem.itemName,
          quantity: action.productItem.quantity, 
          unitCost: action.productItem.unitCost,
          uom: action.productItem.uom 
        })
      }
      product.productItems = productItems;
      await this.productService.update(product);
      return productActions.upsertProductItemSuccess({productId: action.productId, productItems: productItems });
    }),
    catchError((error, caught) => {
      this.store.dispatch(productActions.upsertProductItemFail({error}));
      return caught;
    })
  ));

  upsertProductItemSuccess = createEffect(() => this.actions.pipe(
    ofType(productActions.upsertProductItemSuccess),
    map((action) => {
      this.commonUiService.notify('Product item has been updated.');
    })
  ), {dispatch: false});

  deleteProductItem = createEffect(() => this.actions.pipe(
    ofType(productActions.deleteProductItem),
    switchMap(async (action) =>{
      const product = await this.productService.get(action.productId);
      let productItems = product.productItems; 
      if (productItems != null) {
        productItems = productItems.filter(i => i.itemId != action.productItem.itemId);
      }
      product.productItems = productItems;
      await this.productService.update(product);
      return productActions.deleteProductItemSuccess({productId: action.productId, productItems: productItems })

    }),
    catchError((error, caught) => {
      this.store.dispatch(productActions.deleteProductItemFail({error}));
      return caught;
    })
  ));

  upsertProductAddon = createEffect(() => this.actions.pipe(
    ofType(productActions.upsertProductAddon),
    switchMap(async (action) => {
      const product = await this.productService.get(action.productId);
      let productAddons = product.productAddOns; 
      if (productAddons == null) {
        productAddons = [];
      }
      const productAddon = productAddons.find(a => a.itemId == action.productAddon.itemId);

      if (productAddon != null) {
        Object.assign(productAddon, action.productAddon);
      } else {
        productAddons.push(<ProductAddOn>{
          name: action.productAddon.name,
          price: action.productAddon.price,
          itemId: action.productAddon.itemId, 
          itemName: action.productAddon.itemName,
          itemCost: action.productAddon.itemCost,
          quantity: action.productAddon.quantity,  
        })
      }
      product.productAddOns = productAddons;
      await this.productService.update(product);
      return productActions.upsertProductAddonSuccess({productId: action.productId, productAddons });
    }),
    catchError((error, caught) => {
      this.store.dispatch(productActions.upsertProductAddonFail({error}));
      return caught;
    })
  ));

  upsertProductAddonSuccess = createEffect(() => this.actions.pipe(
    ofType(productActions.upsertProductAddonSuccess),
    map((action) => {
      this.commonUiService.notify('Product addon has been updated.');
    })
  ), {dispatch: false});

  deleteProductAddon = createEffect(() => this.actions.pipe(
    ofType(productActions.deleteProductAddon),
    switchMap(async (action) =>{
      const product = await this.productService.get(action.productId);
      let productAddons = product.productAddOns; 
      if (productAddons != null) {
        productAddons = productAddons.filter(a => a.itemId != action.productAddon.itemId);
      }
      product.productAddOns = productAddons;
      await this.productService.update(product);
      return productActions.deleteProductAddonSuccess({productId: action.productId, productAddons })
    }),
    catchError((error, caught) => {
      this.store.dispatch(productActions.deleteProductAddonFail({error}));
      return caught;
    })
  ));

  
  uploadProductPhoto = createEffect(() => this.actions.pipe(
    ofType(productActions.uploadProductPhoto),
    switchMap(async (action) => {
      const url = await this.fileStorageService.uploadFile(action.file);
      let product = await this.productService.get(action.productId);
      product.imageUrl = url;
      product = await (this.productService.update(product));
      return productActions.uploadProductPhotoSuccess({ productId: product.id, uploadFileUrl: product.imageUrl });
    }),
    catchError((error, caught) => {
      this.store.dispatch(productActions.uploadProductPhotoFail({error}));
      return caught;
    })
  ));

  deleteProductPhoto = createEffect(() => this.actions.pipe(
    ofType(productActions.deleteProductPhoto),
    switchMap(async (action) => {
      let product = await this.productService.get(action.productId);
      await this.fileStorageService.deleteFile(product.imageUrl).toPromise();
      product.imageUrl = null;
      product = await (this.productService.update(product));
      return productActions.deleteProductPhotoSuccess({ productId: product.id });
    }),
    catchError((error, caught) => {
      this.store.dispatch(productActions.deleteProductPhotoFail({error}));
      return caught;
    })
  ));
  
}


