const Thread = require('../models/thread');
const Category = require('../models/category');
const Comment = require('../models/comment');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.comment_create_post = [
    body('text', 'text must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);
        const thread = await Thread.findById(req.params.thread).exec();
        const threadId = thread._id;
        const category = await Category.findOne({ name: req.params.category }).exec();
        const comment = new Comment({
            text: req.body.text,
            time: new Date(),
            thread: threadId,
        });
        if(!errors.isEmpty()) {
            const allComments = await Comment.find({ thread: threadId }).exec();
            res.render('thread_detail', {
                title: 'thread detail',
                thread: thread,
                comment_list: allComments,
            });
            return;
        }
        else {
            await comment.save();
            res.redirect(category.url + thread.url);
        }
    })
];