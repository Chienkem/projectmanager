const express = require("express");
const router = express.Router();
const { Project, Employee, Workon, Recipients, Notification } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const { Op } = require("sequelize");
const pagination = require("../helpers/utils");
const e = require("express");
const insertnotification = async (req, res) => {
   
    console.log(req.body)
    try {
      const result= await Notification.bulkCreate(
          req.body
        )
        res.json(result)
    } catch (error) {
        //Xóa toàn bộ thông tin đã lưu
        console.log(error)
        return res.json({ status: 'error', error: error })
    }
}
const allNotifications = async(req,res)=>{

    try{
        console.log(req.user)
        const result =await Employee.findOne(
            {
                where:{
                    email:req.user.email,
                    role:req.user.role,
                },
                include: [{
                    model: Notification,
                }],
                attributes: { exclude: ["password"] },  
            }
        )
        res.json(result)
    }catch(err){console.log(err)}
}
const isRead = async (req,res)=>{
    console.log(req.body)
    try{
        const result = await Notification.update(  { isRead: '1' },
            {
                where: {
                  id:req.body.id
                }
            }
            )
            res.json(result)
    }catch(err){console.log(err)}
}
module.exports = {
    insertnotification,
    allNotifications,
    isRead ,
}