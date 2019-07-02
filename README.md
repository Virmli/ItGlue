# ItGlue

Requirements: Docker, Node.js, Serverless, Postman

Steps to start the project:
1) Start your docker locally
2) From the root of the project run this command: docker-compose -f postgress.local.yml up. This will scaffold Postgress DB inside your docker
3) Next you will have to cd into itGlue and shared folder and run: npm i Note: your machine should have node installed.
4) After you have npm modules installed from inside itGlue folder in terminal you can run: sls offline. Note if that command is not working for you, you can try this one: node_modules/.bin/sls offline
5) Now when you have this project up and running you will have to pull Postman collection and run 2 set up calls in order to check your DB connection
6) From postman Run Init Data base call
7) Run Health Check this will create interest rate record for itGlue company
8) We have 3 api calls stated in the challenge.

Note: I assumed that input for this assignment will always be correct, so I did not implement sanitizers to check for input.
Also I did not add test coverage.
