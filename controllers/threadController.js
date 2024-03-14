const Thread = require('../models/thread');
const Category = require('../models/category');
const Comment = require('../models/comment');
const asyncHandler = require('express-async-handler');
const { body, check, validationResult } = require('express-validator');

exports.thread_list_get = asyncHandler(async(req, res, next) => {
    const category = await Category.findOne({ name: req.params.category }).exec();
    const threads = await Thread.find({ category: category._id }).exec();

    if(category === null) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
    }

    res.render('thread_list', {
        title: 'list of threads for ' + category.name,
        category: category,
        thread_list: threads,
    })
});

exports.thread_create_get = asyncHandler(async(req, res, next) => {
    const category = await Category.findOne({ name: req.params.category }).exec();
    const allCategory = await Category.find().exec();

    res.render('thread_form', {
        title: 'start a new thread',
        category: category,
        category_list: allCategory,
    })
});

exports.thread_create_post = [
    body('title', 'title must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('text', 'text must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('category', 'category must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    asyncHandler(async(req, res, next) => {
        const category = await Category.findOne({ name: req.params.category }).exec();
        const errors = validationResult(req);

        const thread = new Thread({
            title: req.body.title,
            text: req.body.text,
            last_updated: new Date(),
            category: req.body.category,
        });

        if(!errors.isEmpty()) {
            const allCategory = await Category.find().exec();
            res.render('thread_form', {
                title: 'start a new thread',
                category: req.body.category,
                category_list: allCategory,
                thread: thread,
                errors: errors.array(),
            })
            return;
        }
        else {
            await thread.save();
            res.redirect(category.url + thread.url);
        }
    })
];

exports.thread_detail_get = asyncHandler(async(req, res, next) => {
    const thread = await Thread.findById(req.params.thread).exec();
    const allComments = await Comment.find({ thread: thread._id });
    if(thread === null) {
        const err = new Error('thread not found');
        err.status = 404;
        next(err);
    }
    res.render('thread_detail', {
        title: 'thread detail',
        thread: thread,
        comment_list: allComments,
    });
});