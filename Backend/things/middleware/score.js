

const db = require('../db');

function getWeeksSince(dateString) {
  const joinedDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now - joinedDate;
  const weeks = diffInMs / (1000 * 60 * 60 * 24 * 7);
  return Math.max(1, Math.floor(weeks)); // Prevent divide-by-zero
}


const getStudentsInProject = db.prepare(`
  SELECT up.userID AS userID, up.createdAt
  FROM UserProject up
  JOIN USERS u ON up.userID = u.userid
  WHERE up.projectID = ? AND u.role = 'student'
`);

const getTaskCount = db.prepare(`
  SELECT COUNT(*) AS count FROM TASK 
  WHERE projectID = ? AND userID = ?
`);

const updateScore = db.prepare(`
  UPDATE UserProject SET activityScore = ? WHERE userID = ? AND projectID = ?
`);

const updateProjectScore = db.prepare(`
  UPDATE PROJECT SET projectScore = ? WHERE projectID = ?
`);


function updateActivityScore(projectID) {
  const students = getStudentsInProject.all(projectID);
  let projectScore = 0;

  for (const student of students) {
    const { userID, createdAt } = student;

    const weeks = getWeeksSince(createdAt);
    const contributionCount = getTaskCount.get(projectID, userID).count; // must return { count }

    // Scoring logic with cap at 1 and tolerance of 1 week
    let score = 0;
    if ((weeks - contributionCount) === 1) {
      score = 1;
    } else {
      score = Math.min(contributionCount / weeks, 1);
    }

    updateScore.run(score, userID, projectID); // Assumes updateScore is a prepared stmt
    projectScore += score;
  }
  console.log("loopend");
  const averageScore = students.length > 0 ? projectScore / students.length : 0;
  updateProjectScore.run(averageScore, projectID); // Assumes prepared stmt
}


module.exports = updateActivityScore ;