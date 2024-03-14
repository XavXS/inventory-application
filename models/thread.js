const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    title: { type: String, required: true, minLength: 1, maxLength: 100 },
    text: { type: String, maxLength: 1000},
    last_updated: { type: Date, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
});

ThreadSchema.virtual('url').get(function() {
    return `/${this._id}`;
});

module.exports = mongoose.model('Thread', ThreadSchema);