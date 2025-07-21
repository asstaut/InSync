import Database from 'better-sqlite3';
const db= new Database('../app.db');


//const query=' drop table PROJECT';

// const query = `
// CREATE TABLE TASK(
// taskID INTEGER PRIMARY KEY,
// taskText STRING NOT NULL ,
// projectID INTEGER ,
// userID INTERGER,
// FOREIGN KEY (userID) REFERENCES  USERS(userid),
// FOREIGN KEY (projectID) REFERENCES PROJECT(projectID)
// )
// `;

// const query = `
// CREATE TABLE UserProject(
// userID INTEGER,
// projectID INTEGER ,
// FOREIGN KEY (userID) REFERENCES  USERS(userid),
//FOREIGN KEY (projectID) REFERENCES PROJECT(projectID),
// PRIMARY KEY (userID,projectID)
// )
// `;

// const query = `
// CREATE TABLE COMMENT(
// userID INTEGER,
// projectID INTEGER ,
// commentText string,
// commentID INTEGER PRIMARY KEY,
// FOREIGN KEY (projectID) REFERENCES PROJECT(projectID),
// FOREIGN KEY (userID) REFERENCES  USERS(userid)
// )
// `;


const query = `
CREATE TABLE PROJECT(
projectID INTEGER PRIMARY KEY,
projectTitle STRING NOT NULL ,
projectDescription STRING NOT NULL,
Semester string not null,
projectRepository STRING NOT NULL,
status STRING not null,
proposal BLOB not null
)
`;


// const query = `
// CREATE TABLE USERScopy(
// userid INTEGER PRIMARY KEY,
// username STRING NOT NULL UNIQUE,
// role STRING NOT NULL,
// email NOT NULL UNIQUE,
// password NOT NULL
// )
// `;

db.exec(query);

// const varo= 'hero';
// const user = db.prepare('select * from USERS where username= ?').get(varo);
// console.log(user);
