const config= require('../config/configAdmin')
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define("Employee",
        {
            emp_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull:false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull:false,
            }
            ,name: {
                type: DataTypes.STRING,
                allowNull:false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull:false,
                unique: true,
            },
            sex:{
                type: DataTypes.STRING,
                allowNull:false,
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: true
            },
            detailaddress: {
                type: DataTypes.STRING,
                allowNull:false,
            },
            productivity:{
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            dob:{
                type: DataTypes.DATE,
                allowNull: true,
            },
            role: {
                type: DataTypes.ENUM,
                allowNull:false,
                values: ['1', '2','3','4'],
                 comment: "1:admin,2:manager,3:manager_project,4:employee"
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull:false,
                defaultValue: true
            }
        }

    )
    Employee.sync()
    .then(() => {
        const hash = bcrypt.hashSync(config.password, 10);
        Employee.findOrCreate({
            where: {
                role: config.role
            },
            defaults: {
                email: config.email, 
                password: hash, 
                role: config.role,
                name:config.name,
                sex:config.sex,
                productivity:config.productivity,
                phone: config.phoneNumber,
                detailaddress: config.detailaddress,
                isActive:true
            }
        });
    });
   
    return Employee;
};
