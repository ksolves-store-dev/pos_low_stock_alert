/** @odoo-module **/
///*
//    @Author: KSOLVES India Private Limited
//    @Email: sales@ksolves.com
//*/
import KsProductScreen from 'point_of_sale.ProductScreen';
import Registries from 'point_of_sale.Registries';
import ks_validate_order_items_availability  from './ks_utils.js';
import { _t } from "web.core";
import { Gui } from 'point_of_sale.Gui';

//odoo.define('ks_pos_low_stock_alert.ks_product_screen', function (require) {
//    "use strict";
//    const KsProductScreen = require('point_of_sale.ProductScreen');
//    const ks_utils = require('ks_pos_low_stock_alert.utils');
//    const Registries = require('point_of_sale.Registries');
//
    const ks_product_screen = (KsProductScreen) =>
        class extends KsProductScreen {
            async _onClickPay() {
                var self = this;
                var order = self.env.pos.get_order();
                if(self.ks_validate_order_items_availability(self.env.pos.get_order(), self.env.pos.config)) {
                    var has_valid_product_lot = _.every(order.orderlines.models, function(line){
                        return line.has_valid_product_lot();
                    });
                    if(!has_valid_product_lot){
                        self.showPopup('ConfirmPopup',{
                            'title': _t('Empty Serial/Lot Number'),
                            'body':  _t('One or more product(s) required serial/lot number.'),
                            confirm: function(){
                                self.showScreen('PaymentScreen');
                            },
                        });
                    } else{
                        this.showScreen('PaymentScreen');
                    }
                }

        }
        ks_validate_order_items_availability(ks_order, config, ks_gui) {

            var isValid = true, ks_order_line;

            if(!config.allow_order_when_product_out_of_stock) {
                for(var i = 0; i < ks_order.get_orderlines().length ; i++) {
                    ks_order_line = ks_order.get_orderlines()[i];
                    if(ks_order_line.get_product().type == 'product' && (ks_order_line.get_quantity() > ks_order_line.get_product().qty_available)) {
                        isValid = false;
                        break;
                    }
                }
            }
            if(!isValid){
                Gui.showPopup('ErrorPopup', {
                    title: _t('Cannot order a product more than its availability'),
                    body: _t(ks_order_line.get_product().display_name + ' has only ' + ks_order_line.get_product().qty_available + ' items available. \n You\'re trying to order ' + ks_order_line.get_quantity() + '.'),
                });
            }
            return isValid;
        }
    };

    Registries.Component.extend(KsProductScreen,ks_product_screen);

    return KsProductScreen;