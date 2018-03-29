const express = require('express');
const router = express.Router();

const Image = require('../models/Image');
const checkAuth = require('../middleware/checkAuth');

const ImagesController = require('../controllers/imagesController');

router.post('/', checkAuth, ImagesController.add_new_image);
router.patch('/likes/:imageid', checkAuth, ImagesController.like_image);
router.patch('/unlikes/:imageid', checkAuth, ImagesController.unlike_image);
router.patch('/comments/:imageid', checkAuth, ImagesController.comment_image);
router.post('/allimages', checkAuth, ImagesController.all_images);
router.post('/:id', checkAuth, ImagesController.get_image_on_imageid);
router.post('/user/:userid', checkAuth, ImagesController.get_images_on_userid);

module.exports = router;