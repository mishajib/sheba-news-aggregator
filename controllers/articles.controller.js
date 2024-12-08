const Article = require("../models/article");
const fetchRSSFeeds = require("../utils/fetchRssFeeds");
const extractTopics = require("../utils/extractTopics");

const index = async (req, res) => {
  const { keyword, startDate, endDate } = req.query;
  const filter = {};
  if (keyword) {
    filter.$or = [
      { title: new RegExp(keyword, 'i') },
      { description: new RegExp(keyword, 'i') },
    ];
  }
  if (startDate || endDate) {
    filter.publicationDate = {};
    if (startDate) filter.publicationDate.$gte = new Date(startDate);
    if (endDate) filter.publicationDate.$lte = new Date(endDate);
  }
  try {
    const articles = await Article.find(filter);
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving articles', error: error.message });
  }
};

const fetch = async (req, res) => {
  const { feedUrls } = req.body;
  if (!feedUrls || !Array.isArray(feedUrls)) {
    return res.status(400).json({ message: 'Invalid feed URLs' });
  }
  try {
    const articles = await fetchRSSFeeds(feedUrls);
    for (const article of articles) {
      article.topics = extractTopics(article.description);
      await Article.create(article);
    }
    res.status(201).json({ message: 'Articles fetched and saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error: error.message });
  }
};

module.exports = {
  index,
  fetch,
};
