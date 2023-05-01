/** @odoo-module **/

import Registries from "point_of_sale.Registries";
import KsProductItem from "point_of_sale.ProductItem";

//odoo.define('ks_pos_low_stock_alert.ks_product_list', function (require) {
//    "use strict";
////    const KsProductItem = require('point_of_sale.ProductItem');
////    const Registries = require('point_of_sale.Registries');
//
const { Component } = owl;

    const ks_product_item = (KsProductItem) =>
        class extends KsProductItem {
            addOverlay (){

               var task;
               clearInterval(task);
               task = setTimeout(function () {
                   $(".overlay").parent().addClass('pointer-none');
               }, 100);
            }
        };

    Registries.Component.extend(KsProductItem,ks_product_item);
    return KsProductItem;
//});