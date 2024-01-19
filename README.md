# Northcoders News API
Welcome to Northcoders News API. This project is an API designed to provide programmable access to application data, simulating the functionality of a real-world backend service like Reddit. It allows you to perform various operations related to topics, articles, comments, and users.

To run this project locally you will need to set up the necessary environment files as they have been added to .gitignore. To do this:
1. Create a '.env.development' file and a '.env.test' file in the project root.
2. Open the '.env.development' file and add 'PGDATABASE=nc_news'
3. Open the '.env.test' file and add 'PGDATABASE=nc_news_test'
3. Set up the database by running the command 'npm run setup-dbs'
4. Install project dependencies by running the command 'npm install'
5. Seed the database by running the command 'npm run seed'
6. Start the project by running the command 'npm start'
