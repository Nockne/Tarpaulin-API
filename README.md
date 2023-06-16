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

New Tech, 3rd-Party Libraries, and Other Tools
The final project provides an opportunity to explore and use backend technologies that were not covered in class. You are free to employ different database implementations, third-party libraries, and other tools to enhance your project's functionality and efficiency.

## GitHub Repositories
Your team's code for the final project should be stored in a GitHub repository created via the GitHub Classroom link. The repository will be initially set to private, but you have full administrative control and can make it public if desired. It is recommended to make your repository public, as it showcases your web development abilities and serves as a valuable addition to your CS portfolio. If you already have a GitHub repository for the project, you can simply use git remotes to work with both repositories.

Working with a Team on a Shared GitHub Repo
When collaborating with a team on a shared GitHub repository, it is advisable to follow a workflow that utilizes branches and pull requests. This approach offers several advantages:

Working in separate branches minimizes conflicts that may arise when multiple team members modify the same sections of code simultaneously.
Reviewing pull requests exposes you to the entire codebase, including changes made by other team members. This enhances your familiarity with the project and accelerates development.
The pull request mechanism ensures that code is thoroughly reviewed and approved before being merged into the main code branch. This promotes high-quality code and allows everyone to contribute improvements.
Consider adopting the GitHub flow, a simple and effective branch- and pull-request-based workflow: GitHub Flow Guide.

## Grading Demonstrations
To receive a grade for your project, your team must conduct a brief (10-15 minute) demonstration to the instructor. These demonstrations will be scheduled during finals week, and further details regarding scheduling will be provided later.

Ensure you have a set of written requests/tests prepared to fully demonstrate your API's functionality during the grading demo. You are free to use tools such as Postman or Insomnia for testing purposes. Having these tests ready will contribute to your project's grade.

## Submission
All final project code must be pushed to the main branch of the repository created for your team using the GitHub Classroom link before the grading demo.

## Grading Criteria
Your team's grade (out of 100 points) for the final project will be based on the following criteria:

50 points: Successful implementation of all endpoints specified in the Tarpaulin OpenAPI specification.
10 points: Correct enforcement of authorization requirements for API endpoints.
5 points: Proper implementation of pagination for applicable endpoints.
5 points: Implementation of rate limiting as outlined in the project description.
10 points: Execution of API services within Docker containers.
10 points: Availability of written requests/tests to demonstrate API functionality during the grading demo.
10 points: Design and implementation quality of the API.

[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-7f7980b617ed060a017424585567c406b6ee15c891e84e1186181d67ecf80aa0.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=11297459)
