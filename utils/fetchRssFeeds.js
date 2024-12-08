const RSSParser = require('rss-parser');
const parser = new RSSParser();

async function fetchRSSFeeds(feedUrls) {
    const articles = [];
    try {
        for (const url of feedUrls) {
            const feed = await parser.parseURL(url);
            feed.items.forEach(item => {
                articles.push({
                    title: item.title,
                    description: item.contentSnippet || item.content,
                    publicationDate: new Date(item.pubDate),
                    sourceURL: item.link,
                });
            });
        }
        return articles;
    } catch (error) {
        console.error('Error fetching RSS feeds:', error.message);
        return [];
    }
}

module.exports = fetchRSSFeeds;
