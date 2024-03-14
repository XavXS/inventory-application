const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const commentSchema = new Schema({
    text: { type: String, required: true, minLength: 1, maxLength: 1000 },
    time: { type: Date, required: true },
    thread: { type: Schema.Types.ObjectId, ref: 'Thread', required: true },
});

module.exports = mongoose.model('Comment', commentSchema);