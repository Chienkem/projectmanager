const express = require("express");
const router = express.Router();
const { Project, Employee, Workon,Recipients  } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const { Op } = require("sequelize");
const pagination = require("../helpers/utils");
const e = require("express");


//Thêm nhân viên
const insertProject = async (req, res) => {
    const {
        dataEmployWork,
        name,
        email_manager,
        pay,
        project_money,
        profit,
        manmonth,
        emp_number,
        start_date,
        foresee_end_date
    } = req.body;
    try {
        const result = await Project.create({
            name,
            email_manager: email_manager,
            pay,
            project_money,
            profit,
            manmonth,
            emp_number,
            start_date,
            foresee_end_date

        })
        const project_id = await Project.findOne(
            {
                where: { name: name },
                attributes: ["project_id"]
            });
        const arrayWorkon = dataEmployWork.map(item => ({ ...item, project_id: project_id.dataValues.project_id }))
        const data = await Workon.bulkCreate(
            arrayWorkon
        )
        res.json(data)


    } catch (error) {
        //Xóa toàn bộ thông tin đã lưu
        console.log(error)
        return res.json({ status: 'error', error: error })
    }
}

//THông tin nhân viên
const insertEmployee = async (req, res) => {
    const { email } = req.body
    console.log(req.body)

    const basicInfo = await Employee.findOne({
        where: {
            email: email,
            role: 4
        },
        attributes: ["name", "email", "emp_id"],
    });
    res.json(basicInfo);
};

//THông tin nhân viên
const autoCompleteEmp = async (req, res) => {
    const { email } = req.body
    const auto = await Employee.findAll({
        where: {
            email: {
                [Op.like]: `%${email}%`,
            }, role: 4
        },
        attributes: { exclude: ["password"] },
    });
    res.json(auto)
}

//insert manager_id
const insertProjectManager = async (req, res) => {
    const { email } = req.body

    const basicInfo = await Employee.findAll({
        where: {
            email: {
                [Op.like]: `%${email}%`,
            }, role: 3
        },
        attributes: { exclude: ["password"] },
    });
    res.json(basicInfo);
};

const allProject = async (req, res) => {
    let { offset, limit } = pagination.pagination(req.query, 100)
    try {
        const result = await Project.findAndCountAll({ offset: offset, limit: limit })
        res.json(result)
    } catch {
        console.log({ error: "Lỗi" })
    }
}

const allProjectManager = async (req, res) => {
    let { offset, limit } = pagination.pagination(req.query, 100)
    try {
        const result = await Project.findAndCountAll(
            {
                where: {
                    email_manager: req.user.email,
                },offset: offset, limit: limit,
            })
        res.json(result)
    } catch (err) {res.json(err)}
}
const InfoEmployeeProject = async (req, res) => {
    const id=req.params.id
    try {
        const data = await Project.findOne(
            {
                where: {project_id:id},
                include: [{
                    model: Employee,
                }],
            }
        )
        res.json({data_emp:data.Employees.map(item=>({email:item.email,emp_id:item.emp_id,name:item.name,sex:item.sex,manmonth:item.Workon.manmonth,ability:item.Workon.ability})),data_project:{name:data.name,id:data.project_id}})
    }
    catch (err) { res.json(err); }
}

//status project
const updatestatusProject = async (req, res) => {
    const { status } = req.body
    const id = req.params.id
    console.log(req.body)
    try {
        await Project.update({ status },
            {
                where: {
                    project_id: id,
                }
            })
            .then(result => res.json(result))
            .catch(error => {
                res.status(412).json({ msg: error.message });
            });
    } catch (e) {
        console.log(e);
    }
}

const searchBar = async (req, res) => {
    const q = req.query.q
    let { offset, limit } = pagination.pagination({ page: req.query.page, size: req.query.size })

    try {
        const result = await Project.findAndCountAll(
            {
                where: {
                    [Op.or]: [
                        {
                            project_id: {
                                [Op.like]: `%${q}%`,
                            },
                        },
                        {
                            name: {
                                [Op.like]: `%${q}%`,
                            },
                        },
                        {
                            email_manager: {
                                [Op.like]: `%${q}%`
                            }
                        },
                    ]
                },
                offset: offset,
                limit: limit
            }
            // title LIKE 'Boat%' OR description LIKE '%boat%'
        )
        res.json(result)
    } catch (err) {
        console.error(err)
        res.json(err)
    }
}
//Thông tin dự án
const projectinfo = async (req, res) => {
    const id = req.params.id;
    const basicInfo = await Project.findByPk(id);
    res.json(basicInfo);
};

// Thêm đánh giá
const ability = async (req, res) => {
    const {project_id,emp_id,ability} = req.body
    try {
        const result = await Workon.update({ ability:ability}, {
            where: {
              emp_id:emp_id,
              project_id:project_id,
            }
          })
          res.json(result)
    }catch(e) {
        res.json(e)
    }
}
module.exports = {
    insertProject,
    insertEmployee,
    InfoEmployeeProject,
    insertProjectManager,
    autoCompleteEmp,
    allProject,
    updatestatusProject,
    searchBar,
    projectinfo,
    allProjectManager,
    ability
}

