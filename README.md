
# Web Application Overview

This is a web application that uses Lambda functions as a backend, with DynamoDB as the database, and a front end built with Angular. It includes:

1. A view that lists all the characters created in the database.
2. Each character has the option to edit their location, allowing control over how much the user can edit.
3. A modal for creating new characters.

## Backend Configuration:

DynamoDB was configured by creating two simple tables using `id` as the partition key—one for the characters and another for the locations.

Specific permissions were created for each Lambda function and its main purpose. For example, the `/getCharacters` function has permissions for the `characters` table and a specific permission for `getItems`.

## Frontend Configuration:

The frontend was built using Angular 17.

Interfaces were created for object typing, ensuring that objects follow a defined structure, leveraging the benefits offered by TypeScript.

## Notes:

- It’s important to configure CORS in API Gateway so that Angular and browsers can properly use the endpoints.
- When developing Lambda functions, it’s crucial to define the scope of each function to configure the necessary permissions in DynamoDB.
- When configuring the frontend in CloudFront, it's essential to set up error pages for 400 and 403 errors to redirect to `index.html` with a 200 status code. This ensures that any Angular path is correctly handled by the configuration.
- Also, ensure that the S3 bucket allows public access for content visualization.
