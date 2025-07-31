const Database = require('better-sqlite3');
const db = new Database('db.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS USERS (
    userid INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS PROJECT (
    projectID INTEGER PRIMARY KEY AUTOINCREMENT,
    projectTitle TEXT NOT NULL,
    projectDescription TEXT NOT NULL,
    Semester TEXT NOT NULL,
    projectRepository TEXT NOT NULL,
    status TEXT NOT NULL,
    proposal BLOB NOT NULL,
    joinCode TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS UserProject (
    userID INTEGER,
    projectID INTEGER,
    PRIMARY KEY (userID, projectID),
    FOREIGN KEY (userID) REFERENCES USERS(userid) ON DELETE CASCADE,
    FOREIGN KEY (projectID) REFERENCES PROJECT(projectID) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS COMMENT (
    commentID INTEGER PRIMARY KEY AUTOINCREMENT,
    userID INTEGER,
    projectID INTEGER,
    commentText TEXT,
    FOREIGN KEY (userID) REFERENCES USERS(userid) ON DELETE SET NULL,
    FOREIGN KEY (projectID) REFERENCES PROJECT(projectID) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS TASK (
    taskID INTEGER PRIMARY KEY AUTOINCREMENT,
    taskText TEXT NOT NULL,
    projectID INTEGER,
    userID INTEGER,
    FOREIGN KEY (userID) REFERENCES USERS(userid) ON DELETE SET NULL,
    FOREIGN KEY (projectID) REFERENCES PROJECT(projectID) ON DELETE CASCADE
  );
`);

module.exports = db;
