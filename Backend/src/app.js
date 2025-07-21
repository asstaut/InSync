import Database from 'better-sqlite3';
const db= new Database('app.db');



// db.exec(query);



// const data = [
//     {username: "hero", role:"STUDENT", email:"hero@123.com",password:"1234"}
// ]

// const insertData= db.prepare("INSERT INTO USERScopy ( username, role, email, password ) VALUES(?,?,?,?)");

// data.forEach((user)=>{
//     insertData.run(user.username,user.role,user.email,user.password);
// }
// );

//  const query =('select * from USERScopy ');
// const users = db.prepare(query).all();
//     console.log(users);
const varo= 'hero';
const user = db.prepare('select * from USERS where username= ?').get(varo);
console.log(user);


// const query= 'drop table USERS ;alter table USERScopy RENAME to USERS';
// db.exec(query);


db.close();