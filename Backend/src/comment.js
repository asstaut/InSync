import Database from 'better-sqlite3';
const db= Database('../app.db');
const insertComment= db.prepare("INSERT INTO COMMENTS ( userid, commentText, projectID ) VALUES(?,?,?)");
const deleteComment= db.prepare("DETELE from COMMENTS where commentid = ?")

function newComment(comment){
insertComment.run(comment.projectID,comment.userID,comment.Text)
}


function deleteComment(comment){
deleteComment.run(comment.commentID)
}

function getComments(project){
const varo= project;
const comments = db.prepare('select * from COMMENTS where projectID= ?').get(varo);
return comments;
}

