/** @odoo-module **/
/*
    @Author: KSOLVES India Private Limited
    @Email: sales@ksolves.com
*/

import { _t } from "web.core";
import { Gui } from 'point_of_sale.Gui';
const { Component } = owl;

export class utils extends Component{
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
}
//
//return utils
