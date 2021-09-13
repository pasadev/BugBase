This is the graphical interface of bugbase

The frontend is coded in React.js.

Getting the site up and running.

First, clone the folder into a location of your choosing.

git clone https://hiidari.dy.fi:8023/MPaja/bug-report

Open a terminal for that folder and enter the following command to install dependencies

npm install


With dependencies installed can use the following command to execute webpack scripts in package.json

npm run dev 

When it is compiled, the website can be seen at http://localhost:8080

Follow instructions provided with backend to start it up.

When it is done access localhost of host from inside virtual machine at the following address

http://10.0.2.2:8081/

If needed, change parameter of ip address for backend at src/Components/_helpers


#TODO
-When logged, add link to create issue page in header
-use context functionality for issuepage
-Beautify the css
-Add error handling for case when server is down
-add error handling for case when issue does not exist
-Recent issues from all projects list


#DONE
-centralize ip address parameter for axios calls
-Remove duplicate of unassigned / button appearing in issues list
-Fix bug where choosing project in header does not link to that projects issues list
