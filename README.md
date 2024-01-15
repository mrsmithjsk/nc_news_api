# Northcoders News API
This backend project is an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

To run this project locally you will need to set up the necessary environment files as they have been added to .gitignore. To do this:
1. Create a .env.development file and a .env.test file in the project root.
2. Open the file and add the following PGDATABASE=nc_news and PGDATABASE=nc_news_test in the respective files
3. Set up the database using command npm run setup-dbs
4. Install project dependencies using command npm install
5. Seed the database using command npm run seed
6. Happy coding
