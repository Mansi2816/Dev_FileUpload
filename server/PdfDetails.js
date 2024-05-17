const mongoose = require('mongoose');

const PdfSchema = new mongoose.Schema({
    pdf: String,
    title:String
},{collection: "PdfDetails" })

mongoose.model('PdfDetails', PdfSchema)