const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

function extractTopics(description) {
    const words = tokenizer.tokenize(description);
    return Array.from(new Set(words.filter(word => word.length > 4))); // Only words > 4 chars
}

module.exports = extractTopics;
