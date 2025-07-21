import Database from 'better-sqlite3';
const db= Database('../app.db');
const insertProject= db.prepare("INSERT INTO PROJECTS ( projectTitle, projectDescription, proposal,projectReposity) VALUES(?,?,?)");
const deleteComment= db.prepare("DETELE from PROJECTS where projectID = ?")

function newProject(project){
insertProject.run(project.title,project.description,project.proposa,project.Repository);
}

function deleteProject(project){
deleteComment.run(project.projectID);
}


function getComments(project){
const varo= project;
const comments = db.prepare('select * from COMMENTS where projectID= ?').get(varo);
return comments;
}


