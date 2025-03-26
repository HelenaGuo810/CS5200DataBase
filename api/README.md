# # quiz-06

In this quiz, you will extend the Tweet API by adding new functionality and modifying the database schema.

**Task 1**: Add 4 New Endpoints to the Tweet API

You will need to create the following RESTful API endpoints to manage Tweet items:

1. Create a Tweet Item:
  - Adds a new Tweet item to the database.
  - The userId must be included in the request body when creating a tweet.
  -	Returns the created item.
2. Delete a Tweet Item by ID:
  -	Deletes an existing Tweet item by its ID.
	-	Returns the deleted item.
3. Get a Tweet Item by ID:
  -	Retrieves a Tweet item by its ID.
  -	Returns the requested item.
4. Update a Tweet Item by ID:
  -	Updates an existing Tweet item by its ID.
  -	Returns the updated item.

Refer to the Prisma documentation for help with Prisma-specific syntax when working with CRUD operations: https://www.prisma.io/docs/orm/prisma-client/queries/crud

**Task 2**: Add a New Column to the Users Table and Create an Endpoint

1. Add `preferredName` Column:
  -	Add a new column, `preferredName`, to the existing User model in your Prisma schema.
2. Create an Endpoint:
  -	Implement a new API endpoint that returns a list of users sorted by `preferredName` in ascending order.

## Grading Criteria (10 points total)

1. Create Tweet Endpoint (2 points):
  -	Correctly implements the endpoint for creating a new Tweet item, including the required userId in the request body.
  -	Returns the newly created Tweet item.
2. Delete Tweet Endpoint (2 points):
  -	Successfully implements the delete endpoint by ID.
  -	Returns the deleted Tweet item.
3. Get Tweet by ID (2 points):
  -	Implements the get endpoint to retrieve a Tweet by ID.
  -	Returns the requested item or a proper error if the item doesn’t exist.
4. Update Tweet by ID (2 points):
  -	Correctly implements the update functionality.
  -	Returns the updated item.
5. New PreferredName column (2 points):
  -	Successfully adds the preferredName column to the User table.
  -	Implements the endpoint that returns the user list sorted by preferredName in ascending order.
