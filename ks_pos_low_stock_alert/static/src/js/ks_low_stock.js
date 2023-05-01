odoo.define('ks_pos_low_stock_alert.ks_ps', function (require) {
    "use strict";

//import { patch } from "@web/core/utils/patch";
var { PosGlobalState, Order } = require('point_of_sale.models');
const Registries = require('point_of_sale.Registries');

//import { useRef, useState, useEffect } from "@odoo/owl";

//patch(PosGlobalState.prototype, "KsPosPosGlobalState",{
//      constructor(obj) {
//         super(obj);
////        this.ks_load_product_quantity_after_product();
//
//            onMounted(this.ks_load_product_quantity_after_product());
////        }
//    },

const KsPosPosGlobalState = (PosGlobalState) => class KsPosPosGlobalState extends PosGlobalState {
    constructor(obj) {
         super(obj);
//         this.ks_load_product_quantity_after_product()
    }
    ks_get_model_reference (ks_model_name) {
            var ks_model_index = this.models.map(function (e) {
                return e.model;
            }).indexOf('product.product');
            if (ks_model_index > -1) {
                return this.models[ks_model_index];
            }
            return ks_model_name;
        }

    ks_load_product_quantity_after_product () {
            var ks_product_model = this.ks_get_model_reference('product.product');
            var ks_product_super_loaded = ks_product_model.loaded;
            ks_product_model.loaded = (self, ks_products) => {
                var done = $.Deferred();
                if(!self.config.allow_order_when_product_out_of_stock){
                    var ks_blocked_product_ids = [];
                    for(var i = 0; i < ks_products.length; i++){
                        if(ks_products[i].qty_available <= 0 && ks_products[i].type == 'product'){
                            ks_blocked_product_ids.push(ks_products[i].id);
                        }
                    }
                    var ks_blocked_products = ks_products.filter(function(p, index, arr) {
                        return ks_blocked_product_ids.includes(p.id);
                    });
                    ks_products = ks_products.concat(ks_blocked_products);
                }

                ks_product_super_loaded(self, ks_products);
                self.ks_update_qty_by_product_id(self, ks_products);
                done.resolve();
            }
        }
//
        ks_update_qty_by_product_id(self, ks_products){
            if(!self.db.qty_by_product_id){
                self.db.qty_by_product_id = {};
            }
            ks_products.forEach(ks_product => {
                self.db.qty_by_product_id[ks_product.id] = ks_product.qty_available;
            });
            self.ks_update_qty_on_product();
        }

        ks_update_qty_on_product () {
            var self = this;
            var ks_products = self.db.product_by_id;
            var ks_product_quants = self.db.qty_by_product_id;
            for(var pro_id in self.db.qty_by_product_id){
                ks_products[pro_id].qty_available = ks_product_quants[pro_id];
            }
        }

        push_single_order(ks_order, opts){
            var ks_pushed = super.push_single_order.apply(this, [ks_order, opts])
            if (ks_order){
                this.ks_update_product_qty_from_order(ks_order);
            }
            return ks_pushed;
        }

        ks_update_product_qty_from_order(ks_order){
            var self = this;
            ks_order.orderlines.forEach(line => {
                var ks_product = line.get_product();
                if(ks_product.type == 'product'){
                    ks_product.qty_available -= line.get_quantity();
                    self.ks_update_qty_by_product_id(self, [ks_product]);
                }
            });
        }

}
Registries.Model.extend(PosGlobalState, KsPosPosGlobalState);
})
