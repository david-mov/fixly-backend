-- Migration number: 0001 	 2024-11-08T11:27:42.688Z

CREATE TABLE IF NOT EXISTS reviews(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT,
    comment TEXT,
    rating INTEGER,
    post_date TEXT
) STRICT;
