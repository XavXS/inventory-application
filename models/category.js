const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CategorySchema = new Schema({
    name: { type: String, required: true, minLength: 1, maxLength: 30 },
    description: { type: String, required: true, minLength: 1, maxLength: 100 },
});

CategorySchema.virtual('url').get(function() {
    return '/' + this.name;
})

CategorySchema.virtual('createThreadUrl').get(function() {
    return '/' + this.name + '/create';
});

CategorySchema.virtual('updateUrl').get(function() {
    return '/' + this.name + '/update';
})

module.exports = mongoose.model('Category', CategorySchema);