import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { SharedComponentsModule } from '@app/components/shared-components.module';
import { SalesTrendChartComponent } from './components/sales-trend-chart/sales-trend-chart.component';
import { SalesByPaymentTypeCardComponent } from './components/sales-by-payment-type-card/sales-by-payment-type-card.component';
import { TopSellingProductsCardComponent } from './components/top-selling-products-card/top-selling-products-card.component';
import { LowInventoryAlertsCardComponent } from './components/low-inventory-alerts-card/low-inventory-alerts-card.component';
import { SalesByProductCategoryCardComponent } from './components/sales-by-product-category-card/sales-by-product-category-card.component';
import { SalesActivityCardComponent } from './components/sales-activity-card/sales-activity-card.component';
import { OnhandInventoryLevelsCardComponent } from './components/onhand-inventory-levels-card/onhand-inventory-levels-card.component';
import { InventoryMovementCardComponent } from './components/inventory-movement-card/inventory-movement-card.component';
import { InventoryOverviewCardComponent } from './components/inventory-overview-card/inventory-overview-card.component';
import { InventoryTransactionsCardComponent } from './components/inventory-transactions-card/inventory-transactions-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    HomePageRoutingModule
  ],
  declarations: [
    SalesTrendChartComponent,
    SalesByPaymentTypeCardComponent,
    TopSellingProductsCardComponent,
    LowInventoryAlertsCardComponent,
    SalesByProductCategoryCardComponent,
    SalesActivityCardComponent,
    OnhandInventoryLevelsCardComponent,
    InventoryMovementCardComponent,
    InventoryOverviewCardComponent,
    InventoryTransactionsCardComponent,
    HomePage
  ]
})
export class HomePageModule {}
