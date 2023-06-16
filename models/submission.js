const { DataTypes, DATE } = require('sequelize');
const sequelize = require('../lib/sequelize');

Submission = sequelize.define('submission', {
    //assignmentId --in ../models/assignment.js
    //studentId --in ../models/user.js
    timestamp: { type: DataTypes.DATE, allowNull: false },
    file: { type: DataTypes.STRING }
})

module.exports = Submission;