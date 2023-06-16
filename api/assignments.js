const { Router } = require('express')
const router = Router()

const Assignment = require('../models/assignment');
const Course = require('../models/course');
const {User} = require('../models/user');
const { requireAuthentication } = require('../lib/auth');
const checkUserRole = require('../lib/checkUserRole');
const Submission = require('../models/submission')
const multer = require("multer")
const crypto = require("node:crypto")

// create a new assignment
router.post('/', requireAuthentication, async (req, res, next) => {
  try {
    
    const { userId } = req.user;
    const { courseId, title, points, due } = req.body;
    
    console.log("== This is req.body", req.body);
    console.log("== This is req.user:", req.user);
    console.log("== This is courseId:", courseId);


    // Check if the authenticated user is an admin or an instructor of the course
    let isAdmin = false;
    try {
      isAdmin = await checkUserRole(userId, 'admin');
    } catch (err) {
      console.error("Error in checkUserRole:", err);
    }

    // Check if the user is an instructor of the course
    let isInstructor = false;
    // Uncomment the code block below to check if the user is an instructor
    try {
      isInstructor = await Course.findOne({
        where: {
          id: courseId,
          userId,
        },
      });
    } catch (err) {
      console.error("Error in Course.findOne:", err);
    }

    if (!isAdmin && !isInstructor) {
      return res.status(403).send({
        error: 'The request was not made by an authenticated User satisfying the authorization criteria',
      });
    }

    let assignment;
    try {
      assignment = await Assignment.create({
        courseId,
        title: title,
        points: points,
        due: due,
      });
    } catch (err) {
      console.error("Error in Assignment.create:", err);
      return res.status(400).send({ error: 'There was a problem creating the assignment.' });
    }


    return res.status(201).send({ id: assignment.id });
  } catch (error) {
    console.error("Unhandled error:", error);
    return res.status(400).send({ error: 'The request body was either not present or did not contain a valid Assignment object' });
  }
});

// fetch data about a specific assignment
router.get('/:id', async (req, res, next) => {
  try {
    const assignmentId = req.params.id;

    const assignment = await Assignment.findByPk(assignmentId, {
      attributes: { exclude: ['Submissions'] },
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Specified Assignment id not found' });
    }

    return res.status(200).json({
      id: assignment.courseId,
      title: assignment.title,
      points: assignment.points,
      due: assignment.due
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



// update data for a specific assignment
router.patch('/:id', requireAuthentication, async (req, res, next) => {
  try {
    const assignmentId = req.params.id;
    const { courseId, title, points, due } = req.body;
    const { userId } = req.user;

    // Check if the authenticated user is an admin or an instructor of the course
    const isAdmin = await checkUserRole(userId, 'admin');
    const isInstructor = await Course.findOne({
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

    const assignment = await Assignment.findByPk(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: 'Specified Assignment id not found' });
    }

    await assignment.update({
      id: courseId || assignment.courseId,
      title: title || assignment.title,
      points: points || assignment.points,
      due: due || assignment.due,
    });

    return res.status(200).json({
      id: assignment.courseId,
      title: assignment.title,
      points: assignment.points,
      due: assignment.due,
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
    return res.status(400).json({ error: 'The request body was either not present or did not contain any fields related to Assignment objects' });
  }
});


// delete a specific assignment
router.delete('/:id', requireAuthentication, async (req, res, next) => {
  try {
    const assignmentId = req.params.id;
    const { userId } = req.user;

    console.log("== This is assignmentId:", assignmentId)

    // Check if the authenticated user is an admin or an instructor of the course
    const isAdmin = await checkUserRole(userId, 'admin');
    const isInstructor = await Course.findOne({
      where: {
        id: assignmentId,
        userId: userId,
      },
    });

    if (!isAdmin && !isInstructor) {
      return res.status(403).json({
        error: 'The request was not made by an authenticated User satisfying the authorization criteria',
      });
    }

    const assignment = await Assignment.findByPk(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: 'Specified Assignment id not found' });
    }

    await assignment.destroy();

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return res.status(404).json({ error: 'Specified Assignment id not found' });
  }
});


// fetch the list of all submissions for an assignment
router.get('/:id/submissions', requireAuthentication, async (req, res, next) => {
  const assignmentId = req.params.id
  const { studentId, page } = req.body

  const { userId } = req.user

  let permission = false
  try {

    try {
      permission = checkUserRole(userId, 'admin')
    } catch(e) {
      console.error("Error in checkUserRole:", e)
    }
  
    if(!permission){
      res.status(403).send("Insufficient privileges")
    }

    const submissions = await Submission.findAll({
      where: {
        assignmentId: assignmentId
      }
    })

    if(!submissions) {
      return res.status(404).json({error: 'Assignment not found'})
    }

    res.status(200).json(submissions)

  } catch(e) {
    console.error("Could not find submissions", e)
    res.status(500).json({ error: 'Failed to retrieve submissions. '})
  }
})


const fileTypes = {
  "file/txt": "txt",
  "file/doc": "doc",
  "file/pdf": "pdf"
}


// const upload = multer({
//   storage: multer.diskStorage({
//       destination: `${__dirname}/uploads`,
//       filename: (req, file, callback) => {
//           const filename = crypto.pseudoRandomBytes(16).toString("hex")
//           const extension = fileTypes[file.mimetype]
//           callback(null, `${filename}.${extension}`)
//       }
//   }),
//   fileFilter: (req, file, callback) => {
//       callback(null, !!fileTypes[file.mimetype])
//   }
// })

const upload = multer({ dest: `${__dirname}/uploads` })


// create a new submission for an assignment
router.post('/:id/submissions', upload.single("file"), async (req, res, next) => {
  const courseId = req.params.id
  const { studentId, timestamp, path, assignmentId } = req.body
  console.log(' == req.body: ', req.body)
  console.log(' == req.file: ', req.file)
  try {
    const newSubmission = await Submission.create({ 
      assignmentId, 
      userId: studentId, 
      timestamp, 
      file: path })


    res.status(201).json({
      id: newSubmission.userId,
      assignmentId: newSubmission.assignmentId,
      timestamp: newSubmission.timestamp,
      path: newSubmission.file
    })
  } catch(error) {
    console.error('Error submitting assignment', error)
    res.status(500).json({ error: 'Failed to submit assignment.'})
  }
})

module.exports = router