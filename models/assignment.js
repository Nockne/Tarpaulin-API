const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');
const Submission = require('./submission')


const Assignment = sequelize.define('assignment', {
  //courseId --in ../model/course.js
  title: { type: DataTypes.STRING, allowNull: false },
  points: { type: DataTypes.INTEGER, allowNull: false },
  due: { type: DataTypes.STRING, allowNull: false }
});


//Foreign key for Submission --assignmentId
Assignment.hasMany(Submission, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: { allowNull: false }
})
Submission.belongsTo(Assignment)

module.exports = Assignment;

/*
 * Export an array containing the names of fields the client is allowed to set
 * on their assignments.
 */
exports.AssignmentClientFields = [
    'courseId',
    'title',
    'points',
    'due'
  ];