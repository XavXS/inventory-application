const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const { body, check, validationResult } = require('express-validator')

exports.category_list_get = asyncHandler(async(req, res, next) => {
    const allCategories = await Category.find().exec();
    res.render('category_list', {
        title: "List of Categories",
        category_list: allCategories,
    });
});

exports.category_create_get = asyncHandler(async(req, res, next) => {
    const allCategories = await Category.find().exec();
    res.render('category_form', { 
        title: 'Create Category',
        category_list: allCategories,
    });
});

exports.category_create_post = [
    body('name', 'name must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('description', 'description must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    check('name').custom(async(value) => {
        const dupe = await Category.findOne({ name: value });
        if(dupe !== null) return Promise.reject('category name already in use');
    }),
    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            description: req.body.description,
        })

        if(!errors.isEmpty()) {
            res.render('category_form', {
                title: 'Create Category',
                category: category,
                errors: errors.array(),
            })
            return;
        }
        else {
            console.log('category test pass');
            await category.save();
            res.redirect('/');
        }
    })
];

exports.category_update_get = asyncHandler(async(req, res, next) => {
    const category = await Category.find({ name: req.params.category }).exec();

    if(category === null) {
        const err = new Error('category not found');
        err.status = 404;
        return next(err);
    }

    res.render('category_form', {
        title: 'update category',
        category: category,
    })
});

exports.category_update_post = [
    body('name', 'name must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('description', 'description must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    check('name').custom(async(value) => {
        const dupe = await Category.findOne({ name: value });
        if(dupe !== null) return Promise.reject('category name already in use');
    }),
    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);

        oldCategory = await Category.findOne({ name: req.params.category }).exec();
        categoryId = oldCategory._id;

        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: categoryId,
        })

        if(!errors.isEmpty()) {
            res.render('category_form', {
                title: 'Update Category',
                category: category,
                errors: errors.array(),
            })
            return;
        }
        else {
            await Category.findByIdAndUpdate(categoryId, category, {});
            res.redirect(category.url);
        }
    })
];