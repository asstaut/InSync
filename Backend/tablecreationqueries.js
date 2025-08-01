const Database = require('better-sqlite3');
const db = new Database('things/db.db');

// db.exec(`
//   CREATE TABLE IF NOT EXISTS USERS (
//     userid INTEGER PRIMARY KEY AUTOINCREMENT,
//     username TEXT NOT NULL,
//     email TEXT UNIQUE NOT NULL,
//     password TEXT NOT NULL,
//     Role TEXT NOT NULL
//   );

//   CREATE TABLE IF NOT EXISTS PROJECT (
//     projectID INTEGER PRIMARY KEY AUTOINCREMENT,
//     projectTitle TEXT NOT NULL,
//     projectDescription TEXT NOT NULL,
//     Semester TEXT NOT NULL,
//     projectRepository TEXT NOT NULL,
//     status TEXT NOT NULL,
//     proposal BLOB NOT NULL,
//     joinCode TEXT UNIQUE,
//     projectScore INTERGER,
//     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP  
//   );

//   CREATE TABLE IF NOT EXISTS UserProject (
//     userID INTEGER,
//     projectID INTEGER,
//     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
//     activityScore INTEGER DEFAULT 1,
//     PRIMARY KEY (userID, projectID),
//     FOREIGN KEY (userID) REFERENCES USERS(userid) ON DELETE CASCADE,
//     FOREIGN KEY (projectID) REFERENCES PROJECT(projectID) ON DELETE CASCADE
//   );

//   CREATE TABLE IF NOT EXISTS COMMENT (
//     commentID INTEGER PRIMARY KEY AUTOINCREMENT,
//     userID INTEGER,
//     projectID INTEGER,
//     commentText TEXT,
//     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
//     FOREIGN KEY (userID) REFERENCES USERS(userid) ON DELETE SET NULL,
//     FOREIGN KEY (projectID) REFERENCES PROJECT(projectID) ON DELETE CASCADE
//   );

//   CREATE TABLE IF NOT EXISTS TASK (
//     taskID INTEGER PRIMARY KEY AUTOINCREMENT,
//     taskText TEXT NOT NULL,
//     projectID INTEGER,
//     userID INTEGER,
//     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
//     FOREIGN KEY (userID) REFERENCES USERS(userid) ON DELETE SET NULL,
//     FOREIGN KEY (projectID) REFERENCES PROJECT(projectID) ON DELETE CASCADE
//   );
// `);

db.exec(`
  ALTER TABLE UserProject ADD activityScore INTEGER DEFAULT 1;
  ALTER TABLE PROJECT ADD projectScore INTEGER DEFAULT 1;


  ALTER TABLE UserProject DROP activityScore ;
  ALTER TABLE PROJECT DROP projectScore ;
  
  `);



module.exports = db;


