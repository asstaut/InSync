import Database from 'better-sqlite3';
const db= Database('../app.db');
const insertProject= db.prepare("INSERT INTO TASKS ( title, description, proposal) VALUES(?,?,?)");
const deletetask= db.prepare("DELETE from TASKS where projectID = ?")

function newask(user,task,project){
insertProject.run(task.text,project.id,user.id,task.duedate,task.createddate);
}


function deleteTask(task){
deleteComment.run(task.taskID);
}



function getComments(project){
const varo= project;
const comments = db.prepare('select * from COMMENTS where projectID= ?').get(varo);
return comments;
}



// const query = `
// CREATE TABLE task(
// taskID INTEGER PRIMARY KEY,
// taskText STRING NOT NULL ,
// projectID INTEGER ,
// userID INTERGER,
// FOREIGN KEY ()
// )
// `;

// const query = `
// CREATE TABLE UserProject(
// userID INTEGER,
// projectID INTEGER ,
// FOREIGN KEY ().
// PRIMARY KEY (userID,projectID)
// )
// `;


