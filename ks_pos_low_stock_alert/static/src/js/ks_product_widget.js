/** @odoo-module **/
/*
    @Author: KSOLVES India Private Limited
    @Email: sales@ksolves.com
*/

import Registries from "point_of_sale.Registries";
import PosComponent from 'point_of_sale.ProductsWidget';
import { patch } from "@web/core/utils/patch";


patch(PosComponent.prototype, 'ks_pos_low_stock_alert.KsProductWidget', {
        get productsToDisplay() {
            const list = this._super();
            return list.sort((a, b) => b.qty_available - a.qty_available);
        }

})

