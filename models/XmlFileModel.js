const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const XmlFileSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },
    xmlString: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const XmlFile = mongoose.model('XmlFile', XmlFileSchema);

module.exports = XmlFile;
