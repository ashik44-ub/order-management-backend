const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  opNo: { type: String, required: true },
  customerName: { type: String, required: true },
  partsName: { type: String, required: true },
  totalQtyOrdered: { type: Number, required: true },
  qtyDelivered: { type: Number, required: true },
  pendingQty: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  advancedPaid: { type: Number, required: true },
  dueAmount: { type: Number, required: true },
  chequeNo: { type: String },
  chequeDate: { type: String },
  deliveryDate: { type: String },
  partsStatus: { type: String, required: true },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Part', partSchema);
