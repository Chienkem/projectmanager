const Employee = require('../models/employee.js')
const Project = require('../models/project.js')
module.exports = (sequelize, DataTypes) => {
    const Workon = sequelize.define("Workon",
        {
            manmonth: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ability: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "chưa có nhận xét"
            },
        },
    )

    Workon.associate = (models) => {
        models.Employee.belongsToMany(models.Project, {
            through: Workon,
            foreignKey: "emp_id",
            allowNull: true
        });
        models.Project.belongsToMany(models.Employee, {
            through: Workon,
            foreignKey: "project_id",
            allowNull: true
        });
    }

    return Workon;
};
