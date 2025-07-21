import Database from 'better-sqlite3';
const db= new Database('app.db');


function getUserProjects(user){
const varo= user.id;
const projects = db.prepare('select p.projectTitle, p.projectDescripion from project p join ProjectUser pu on  pu.userID= ?').get(varo);
return projects;
}


function getProjectComments(project){
const varo= project.id;
const comments = db.prepare('select * from COMMENTS where projectID= ?').get(varo);
return comments;
}

function getProjectDetails(project){
const varo= project.id;
const details = db.prepare('select projectTitle, projectDescription, projectRepository, status from PROJECT where projectID= ?').get(varo);
return details;

}

function getProjectMembers(project){
const users= db.prepare('select pu.userID from project p join ProjectUser pu on  pu.projectID= ?').get(project.ID);
return users;
}


