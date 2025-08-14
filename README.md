
In Sync is a collaborative project tracking platform designed to streamline academic and organizational project management. The application enables users—students and supervisors—to create, join, and manage projects efficiently.

PREREQUISITES:
node.js is already installed on the computer/project directory.

1. create a .env file in both Backend and Frontend folders

in Backend/.env
JWT_SECRET=<insert A long, cryptographically strong, random string/>
PORT=<insert local port number>

in Frontend/.env
NEXT_PUBLIC_API_URL=<insert link of the backend api url>
example URL - http://localhost:4000/api

<!-- 
2.Go to the terminal , open the project directory and run 
 node start.js  -->


2. Open two terminals at the project directory, and run 
    cd Backend
    node Backend/things/index

    and
    cd Frontend
    npm run dev --prefix 




