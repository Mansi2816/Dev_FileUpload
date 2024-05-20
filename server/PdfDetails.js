const mongoose = require('mongoose');

const PdfSchema = new mongoose.Schema({
    pdf: String,
    title:String
},{collection: "PdfDetails" })

module.exports = mongoose.model('PdfDetails', PdfSchema);
