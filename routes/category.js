const express = require('express');
const router = express.Router();

const category_controller = require('../controllers/categoryController');
const thread_controller = require('../controllers/threadController')
const comment_controller = require('../controllers/commentController');

router.get('/', category_controller.category_list_get);

router.get('/create', category_controller.category_create_get);

router.post('/create', category_controller.category_create_post);

router.get('/:category/update', category_controller.category_update_get);

router.post('/:category/update', category_controller.category_update_post);

router.get('/:category', thread_controller.thread_list_get);

router.get('/:category/create', thread_controller.thread_create_get);

router.post('/:category/create', thread_controller.thread_create_post);

router.get('/:category/:thread', thread_controller.thread_detail_get);

router.post('/:category/:thread', comment_controller.comment_create_post);


module.exports = router;