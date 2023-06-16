const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');
const Assignment = require('../models/assignment')


const Course = sequelize.define('course', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  subject: { type: DataTypes.STRING, allowNull: false},
  number: { type: DataTypes.INTEGER, allowNull: false},
  title: { type: DataTypes.STRING, allowNull: false},
  term: { type: DataTypes.STRING, allowNull: false},
});


//Foreign Key for Assignment --courseId
Course.hasMany(Assignment, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: { allowNull: false }
})
Assignment.belongsTo(Course)
module.exports = Course;