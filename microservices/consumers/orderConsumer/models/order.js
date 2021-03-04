const mongoose = require('mongoose');
const Schema = mongoose.Schema
const MUUID = require('uuid-mongodb').mode('relaxed');

let uuidValidator = (id) => {
    if (id != null) {
        return MUUID.from(id.toObject())
    }
}

let Status = new Schema({
    _id: false,
    status: {type: String},
    timestamp: {type: Date, default: Date.now }
})

let Order = new Schema({
    orderId: {type: Buffer, unique: true, subtype: 4, default: () => MUUID.v4(), validate: {validator: uuidValidator}},
    userId: {type: Buffer, subtype: 4, default: () => MUUID.v4(), validate: {validator: uuidValidator}},
    kitchenId: {type: Buffer, subtype: 4, default: () => MUUID.v4(), validate: {validator: uuidValidator}},
    status: {type: String},
    dish: {type: String},
    statusHistory: [Status],
    totalPrice: {type: mongoose.Types.Decimal128 , required: true}
})

Order.path('orderId').get((orderId) => {
    return MUUID.from(orderId.toObject());
})
Order.path('userId').get((userId) => {
    return MUUID.from(userId.toObject());
})
Order.path('kitchenId').get((kitchenId) => {
    return MUUID.from(kitchenId.toObject());
})
Order.path('totalPrice').get((price) => {
    return Number(price.toString());
})
Order.set('toJSON', { getters: true, virtuals: false});

module.exports = mongoose.model("Order", Order)