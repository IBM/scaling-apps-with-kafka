const mongoose = require('mongoose');
const Schema = mongoose.Schema
const MUUID = require('uuid-mongodb').mode('relaxed');

let uuidValidator = (id) => {
    if (id != null) {
        return MUUID.from(id.toObject())
    }
}
let Menu = new Schema({
    _id: false,
    item: {type: String},
    price: {type: mongoose.Types.Decimal128}
})

let Kitchen = new Schema({
    kitchenId: {type: Buffer, unique: true, subtype: 4, default: () => MUUID.v4(), validate: {validator: uuidValidator}},
    name: {type: String},
    image: {type: String},
    type: {type: String},
    menu: [Menu]
})

Kitchen.path('kitchenId').get((kitchenId) => {
    return MUUID.from(kitchenId.toObject());
})
Menu.path('price').get((price) => {
    return Number(price.toString());
})
Menu.set('toJSON', { getters: true, virtuals: false});
Kitchen.set('toJSON', { getters: true, virtuals: false});

module.exports = mongoose.model("Kitchen", Kitchen)