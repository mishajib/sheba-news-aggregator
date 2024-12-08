# News Aggregator Application

## Overview

This is a Node.js-based News Aggregator application that fetches, processes, and stores news articles from multiple RSS
feeds. It provides APIs for retrieving articles with optional filters, such as keywords and publication dates, and
periodically fetches new articles. Additionally, the application extracts topics from the articles to enhance the stored
data.

---

## Features

- **Fetch Articles**: Retrieve articles from a configurable list of RSS feed URLs.
- **Persist Data**: Save fetched articles in a MongoDB database.
- **Topic Extraction**: Automatically extract topics from article content.
- **Filter Articles**: API to filter articles based on keywords or publication date.
- **Scheduling**: Periodically fetch and process new articles.
- **Error Handling**: Handle invalid RSS URLs, network errors, and database conflicts.

---

## Approach

### 1. **Fetching RSS Feeds**

The application uses the `rss-parser` library to fetch and parse RSS feeds. A utility function processes each feed URL,
extracts article details, and handles errors gracefully to ensure uninterrupted fetching.

### 2. **Data Persistence**

Articles are stored in a MongoDB database using the Mongoose ODM. The schema ensures that essential fields such as
`title`, `description`, `publicationDate`, `sourceURL`, and extracted `topics` are persisted efficiently.

### 3. **Topic Extraction**

For topic extraction, the application:

- Uses the `natural` library to tokenize the article content.
- Filters unique words with more than four characters to derive basic topics.
- Supports integration with external APIs like OpenAI for advanced topic modeling.

### 4. **Filtering and Retrieval**

The GET API supports filters such as:

- **Keywords**: Match keywords in the article title or description.
- **Publication Dates**: Specify start and/or end dates to filter articles by their publication date.

### 5. **Scheduling**

Using `node-schedule`, the application periodically fetches new articles from the configured RSS feeds. This ensures the
database remains up-to-date with the latest news.

---

## Data Structures

### MongoDB Schema for Articles

```javascript
const articleSchema = new mongoose.Schema({
    title: String,                 // Title of the article
    description: String,           // Short description or summary
    publicationDate: Date,         // Date when the article was published
    sourceURL: String,             // URL of the original article
    topics: [String],              // List of extracted topics
});
```

- **Title**: Stores the headline of the article.
- **Description**: Holds the content snippet or description.
- **Publication Date**: Ensures articles can be filtered by time.
- **Source URL**: Tracks the source of the article.
- **Topics**: Contains keywords extracted from the content.

### Sample Article Document

```json
{
  "title": "Global Economy Update",
  "description": "A deep dive into the global economy trends for 2024.",
  "publicationDate": "2024-12-06T12:00:00Z",
  "sourceURL": "https://example.com/economy",
  "topics": [
    "global",
    "economy",
    "trends"
  ]
}
```

---

## Topic Extraction Method

### Basic Method

- **Library Used**: `natural`
- **Steps**:
    1. Tokenize the article description into individual words.
    2. Filter words longer than four characters (to focus on meaningful terms).
    3. Return a unique list of keywords as topics.

---

## API Endpoints

### 1. **Fetch and Save Articles**

- **POST** `/api/articles/fetch`
- **Request Body**:
  ```json
  {
    "feedUrls": [
      "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
      "https://feeds.bbci.co.uk/news/rss.xml"
    ]
  }
  ```
- **Response**:
  ```json
  {
    "message": "Articles fetched and saved successfully!"
  }
  ```

### 2. **Retrieve Articles with Filters**

- **GET** `/api/articles`
- **Query Parameters**:
    - `keyword` (optional): Filter by keyword in title or description.
    - `startDate` (optional): Filter articles published after this date.
    - `endDate` (optional): Filter articles published before this date.
- **Response**:
  ```json
  [
    {
      "title": "Global Economy Update",
      "description": "A deep dive into the global economy trends for 2024.",
      "publicationDate": "2024-12-06T12:00:00Z",
      "sourceURL": "https://example.com/economy",
      "topics": ["global", "economy", "trends"]
    }
  ]
  ```

---

## Environment Setup

1. **Environment Variables**:
   Copy the `.env.example` file to `.env` and update the values as needed.

2. **Run these commands step by step**:
   ```bash
   docker compose build
   ```

   Then run:

    ```bash
    docker compose up
    ```
   or
   ```bash
    docker compose up -d
    ```

3. **Open the browser and navigate to**:
    - `http://localhost:9001/api/articles/fetch` to fetch and save articles.
    - `http://localhost:9001/api/articles` to retrieve articles with optional filters.

---

## Conclusion

This News Aggregator application is designed to be scalable, modular, and extensible. With robust error handling,
automated scheduling, and intelligent topic extraction, it meets the requirements for aggregating and processing news
efficiently. Additional features like filtering and advanced NLP integration ensure enhanced usability and data insight.

