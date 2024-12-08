const schedule = require('node-schedule');
const fetchRSSFeeds = require('../utils/fetchRssFeeds');
const extractTopics = require('../utils/extractTopics');
const Article = require('../models/article');

function scheduleRSSFetching(feedUrls) {
    schedule.scheduleJob('0 * * * *', async () => { // Runs every hour
        const articles = await fetchRSSFeeds(feedUrls);
        for (const article of articles) {
            article.topics = extractTopics(article.description);
            try {
                await Article.create(article);
            } catch (error) {
                console.error('Error saving article:', error.message);
            }
        }
    });
}

module.exports = scheduleRSSFetching;
