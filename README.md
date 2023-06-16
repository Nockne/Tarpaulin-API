# Tarpaulin API

Tarpaulin is a lightweight course management tool that serves as an alternative to Canvas. This project involves creating an API for Tarpaulin, enabling users (instructors and students) to access and interact with course information. Instructors can create assignments, while students can submit solutions to those assignments.

## API Specification
The Tarpaulin API must support all the endpoints described in the Tarpaulin OpenAPI specification. To view the automatically-generated documentation for these endpoints, you can load the specification into the Swagger Editor.

While implementing the API, you have the freedom to choose the database and design the API architecture according to your needs.

## Entities
The Tarpaulin API needs to manage several entities:

Users: Represent Tarpaulin application users. Each user has one of three roles: admin, instructor, or student. The roles determine the permissions associated with the user for performing various API actions. Refer to the Tarpaulin OpenAPI specification for further details on role permissions.

Courses: Represent the courses managed in Tarpaulin. Each course contains basic information such as subject code, number, title, instructor, etc. Additionally, a course has associated data, including a list of enrolled students (Tarpaulin Users with the student role) and a set of assignments. Detailed information on managing these data pieces can be found in the Tarpaulin OpenAPI specification.

Assignments: Represent individual assignments for Tarpaulin courses. Each assignment belongs to a specific course and includes basic information like title, due date, etc. It also maintains a list of student submissions.

Submissions: Represent student submissions for assignments in Tarpaulin. Each submission is associated with an assignment and the student who submitted it. It includes a submission timestamp and a specific file that is uploaded to the Tarpaulin API for later download. Additionally, submissions can be assigned grades through update operations but not during the initial creation.

## Actions
The Tarpaulin API supports various actions, including fetching entity data, creating, modifying, and deleting entities. Most of these actions are similar to the ones covered in class. However, some actions require additional attention:

Course roster download: This action is performed using the GET /courses/{id}/roster endpoint. Authorized users can download a CSV-formatted roster for a specific course. The roster contains a list of currently enrolled students, including their identifiers, names, and email addresses. The API must generate this file based on the enrolled students' data stored in the database.

Assignment submission creation: The POST /assignments/{id}/submissions endpoint allows authorized student users to upload a file submission for a specific assignment. The API should store the uploaded submission file in a way that allows it to be later downloaded via URL. The URL for accessing the file should be returned along with other submission information when retrieving submissions using the GET /assignments/{id}/submissions endpoint.

User data fetching: The GET /users/{id} endpoint enables users to view their own data. Only logged-in users can access their data. The response should include the list of classes in which the user is enrolled (for student users) or teaching (for instructor users).

Course information fetching: The GET /courses and GET /courses/{id} endpoints provide users with information about all courses or a specific course, respectively. It's important to note that these endpoints should not return information about enrolled students or assignments for the course. Separate endpoints, such as GET /courses/{id}/students and GET /courses/{id}/assignments, should be used to fetch that information.

## Pagination
Certain Tarpaulin API endpoints require pagination:

GET /courses
GET /assignments/{id}/submissions
You have the flexibility to determine the appropriate pagination approach, including setting the page size and other related parameters.

## Authorization
Authorization is required for many endpoints in the Tarpaulin API. The Tarpaulin OpenAPI specification provides details on the required authorization schemes, which can be implemented using the standard JWT-based authentication mechanism discussed in class.

## Rate Limiting
To ensure optimal performance and prevent abuse, rate limiting should be applied to the Tarpaulin API:

For requests made without a valid authentication token, the API should allow a maximum of 10 requests per minute per IP address.
For requests made with a valid authentication token, the API should permit a maximum of 30 requests per minute per user.
Docker Containerization
All services utilized by the Tarpaulin API, such as databases, caches, and processing pipelines, should be executed within Docker containers. You can create and initialize these containers manually via the command line.
