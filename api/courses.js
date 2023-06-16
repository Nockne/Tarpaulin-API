const { Router } = require('express')
const Courses = require('../models/course')
const { off } = require('process')
const { link } = require('fs')
const { ValidationError } = require('sequelize')
const { requireAuthentication } = require('../lib/auth')
const checkUserRole = require('../lib/checkUserRole');
const Assignment = require('../models/assignment')
const router = Router()

// fetch the list of all courses
router.get('/', async (req, res, next) => {
    let page = parseInt(req.query.page) || 1
    page = Math.max(page, 1)

    const pageSize = 10
    const offset = (page - 1) * pageSize

    const result = await Courses.findAll({
        limit: pageSize,
        offset: offset
    })

    const lastPage = Math.ceil(result.count / pageSize)
    const links = {}
    if (page < lastPage) {
        links.nextPage = `/courses?page=${page + 1}`
        links.lastPagePage = `/courses?page=${lastPage}`
    } 

    if (page > 1) {
        links.prevPage = `/courses?page=${page - 1}`
        links.firstPage = `/courses?page=1`
    }

    res.status(200).send({
        courses: result.rows,
        pageNumber: page,
        totalPages: lastPage,
        pageSize: pageSize,
        totalCount: result.count,
        links: links
    })

})


// create a new course
router.post('/', requireAuthentication, async (req, res, next) => {
    const { subject, number, title, term } = req.body

    try {
        const { userId } = req.user
        let hasRequiredRole = false
        try {
            hasRequiredRole = await checkUserRole(userId, 'admin');
        } catch (e) {
            console.error(" Error in checkUserRole: ", e)
        }
        if (!hasRequiredRole) {
        res.status(403).send('Insufficient privileges');
        return;
        }

        const newCourse = await Courses.create({
            subject, 
            number, 
            title, 
            term, 
            userId})

        res.status(201).json({
            id: newCourse.id, 
            subject: newCourse.subject, 
            number: newCourse.number, 
            title: newCourse.title,
            term: newCourse.term,
            instructorId: newCourse.instructorId
        })
    } catch(e) {
        if (e instanceof ValidationError) {
            res.status(400).send({ error: e.message })
          } else {
            next(e)
          }
    }
})


// fetch data about specific course
router.get('/:id', async (req, res, next) => {
    try {
      const courseId = req.params.id;
  
      const course = await Courses.findByPk(courseId, {
        attributes: {
          exclude: ['instructorId'], // Exclude the instructorId from the response
        },
      });
  
      if (!course) {
        return res.status(404).json({ error: 'Specified Course id not found' });
      }
  
      return res.status(200).json({
        id: course.id,
        subject: course.subject,
        number: course.number,
        title: course.title,
        term: course.term,
      });
    } catch (error) {
      console.error('Error fetching course:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });


// update data for a specific course
router.patch('/:id', requireAuthentication, async (req, res, next) => {
    try {
      const courseId = req.params.id;
      const { userId } = req.user;
      const { subject, number, title, term, instructorId } = req.body;
  
      // Check if the authenticated user is an admin or an instructor of the course
      const isAdmin = await checkUserRole(userId, 'admin');
      const isInstructor = await Courses.findOne({
        where: {
          id: courseId,
          userId: userId,
        },
      });
  
      if (!isAdmin && !isInstructor) {
        return res.status(403).json({
          error: 'The request was not made by an authenticated User satisfying the authorization criteria',
        });
      }
  
      const course = await Courses.findByPk(courseId);
  
      if (!course) {
        return res.status(404).json({ error: 'Specified Course id not found' });
      }
  
      await course.update({
        subject: subject || course.subject,
        number: number || course.number,
        title: title || course.title,
        term: term || course.term,
        instructorId: instructorId || course.instructorId,
      });
  
      return res.status(200).json({
        id: course.id,
        subject: course.subject,
        number: course.number,
        title: course.title,
        term: course.term,
        instructorId: course.instructorId,
      });
    } catch (error) {
      console.error('Error updating course:', error);
      return res.status(400).json({ error: 'The request body was either not present or did not contain any fields related to Course objects' });
    }
  });

// delete a specific course
router.delete('/:id', requireAuthentication, async (req, res, next) => {
    try {
      const courseId = req.params.id;
      const { userId } = req.user;
  
      // Check if the authenticated user is an admin
      const isAdmin = await checkUserRole(userId, 'admin');
  
      if (!isAdmin) {
        return res.status(403).json({
          error: 'The request was not made by an authenticated User satisfying the authorization criteria',
        });
      }
  
      const course = await Courses.findByPk(courseId);
  
      if (!course) {
        return res.status(404).json({ error: 'Specified Course id not found' });
      }
  
      await course.destroy();
  
      return res.status(200).json({ message: 'Course successfully removed' });
    } catch (error) {
      console.error('Error deleting course:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });


// fetch a list of students in a course
router.get('/:id/students', (req, res, next) => {
    res.status(201).send(req.body)
})


// fetch a csv file containing list of students enrolled
router.get('/:id/roster', (req, res, next) => {
    res.status(201).send(req.body)
})


// fetch a list of assignments for the course
router.get('/:id/assignments', async (req, res, next) => {
    try {
      const courseId = req.params.id;
  
      const course = await Assignment.findall(courseId);
      if (!course) {
        return res.status(404).json({ error: 'Specified Course id not found' });
      }
  
      const assignments = await Assignment.findAll({
        where: {
          courseId: courseId,
        },
        attributes: ['id'], // Only select the ID of each assignment
        raw: true,
      });
  
      const assignmentIds = assignments.map((assignment) => assignment.id);
  
      return res.status(200).json(assignmentIds);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
module.exports = router