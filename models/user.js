const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')
const Course = require('./course')
const Submission = require('./submission')
const Assignment = require('./assignment')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: { type: DataTypes.STRING, allowNull: false},
    email: { type: DataTypes.STRING, allowNull: false, unique: true},
    password: { type: DataTypes.STRING, allowNull: false},
    role: { type: DataTypes.STRING, allowNull: false}
  })


//Foreign key for Courses --instructorId
User.hasMany(Course , {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: { allowNull: false }
})
Course.belongsTo(User)


// //Foreign key for Submission --studentId
User.hasMany(Submission, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: { allowNull: false }
})
Submission.belongsTo(User)

  module.exports = { User }