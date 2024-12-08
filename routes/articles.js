const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/articles.controller');


// Get all articles with optional filters
router.get('/', ArticleController.index);


// Add an RSS feed to fetch articles
router.post('/fetch', ArticleController.fetch);

module.exports = router;
