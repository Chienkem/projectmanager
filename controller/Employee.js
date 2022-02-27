const express = require("express");
const router = express.Router();
const { Employee } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const { Op } = require("sequelize");
const pagination = require("../helpers/utils")

//Thêm nhân viên
const insertEmployee = async (req, res) => {
  console.log(req.body)
  const {
    email,
    password,
    name,
    phone,
    sex,
    detailaddress,
    productivity,
    role,
    dob
  } = req.body;
  const hash = bcrypt.hashSync(password, 10); 
  try {
    await Employee.create({
      email,
      password: hash,
      name,
      phone,
      sex,
      detailaddress,
      productivity,
      role,
      dob
    })
      .then(result => res.json("Thêm Thành Công"))
      .catch(error => {
        res.json({ error });
      })

  } catch (error) {
    return res.json({ status: 'error', error: 'Username already in use' })
  }
}

// Đặng nhập
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Employee.findOne({ where: { email: email } });

  if (!user) return res.json({ error: "User Doesn't Exist" });

  else {
    bcrypt.compare(password, user.password).then(async (match) => {
      if (!match) return res.json({ error: "Wrong email And Password Combination" });

      const accessToken = sign(
        { email: user.email, id: user.id, role: user.role, isActive: user.isActive },
        "importantsecret"
      );
      return res.json({ token: accessToken });
    });
  }
}

//Xác thực
const auth = (req, res) => {
  res.json(req.user);
}
//THông tin nhân viên
const employeeinfo = async (req, res) => {
  const id = req.params.id;
  const basicInfo = await Employee.findByPk(id, {
    attributes: { exclude: ["password"] },  
  });
  res.json(basicInfo);
};

//Tất cả nhân viên
const allEmployee = async (req, res) => {
  let { offset, limit } = pagination.pagination(req.query, 100)
  try {
    const allEmploy = await Employee.findAndCountAll({
      attributes: { exclude: ["password"] },
      where: {
        [Op.not]: [
          { role: ['1', req.user.role] }]
      },
      limit: limit,
      offset: offset
    }).then((result) => {
      res.json(result)
    }).catch(error => console.log(error));
    ;
  }
  catch {
    res.json("Lỗi")
  }
}
//Đổi mật khẩu
const changePassword = async (req, res) => {
  const { oldpassword, newpassword } = req.body
  const user = await Employee.findOne({ where: { email: req.user.email } })

  bcrypt.compare(oldpassword, user.password).then(async (match) => {
    if (!match) return res.json({ error: "Wrong Password Entered!" });

    bcrypt.hash(newpassword, 10).then((hash) => {
      Employee.update(
        { password: hash },
        { where: { email: req.user.email } }
      );
      return res.json("SUCCESS");
    });
  });
}
//chặn người dùng 
const updateAcitveEmployee = async (req, res) => {
  const { isActive } = req.body
  const id = req.params.id
  console.log(isActive)
  try {
    await Employee.update({ isActive },
      {
        where: {
          emp_id: id,
          [Op.not]: [
            { role: ['1', req.user.role] }]
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
//update thông tin người dùng
const updateEmployee = async (req, res) => {
  const id = req.params.id
  try {
    await Employee.update(req.body,
      {
        where: {
          emp_id: id,
          [Op.not]: [
            { role: ['1', req.user.role] }]
        },
      })
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({ error: error });
      });
  } catch (e) {
    console.log(e);
  }
}

// update proflie
const updateProfile = async (req, res) => {
  const id = req.params.id
  try {
    await Employee.update(req.body,
      {
        where: {
          emp_id: id
        }
      })
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({ error: error });
      });
  } catch (e) {
    console.log(e);
  }
}
//profile
const profile = async (req, res) => {
  try {
    await Employee.findOne(
      {
        attributes: { exclude: ["password"] },
        where: {
          email: req.user.email
        }
      })
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({ error: error });
      });
  } catch (e) {
    console.log(e);
  }
}
//Tìm kiếm nhân viên
const searchBar = async (req,res)=>{
  const q = req.query.q
  let { offset, limit } = pagination.pagination({page:req.query.page,size:req.query.size})
  
  try{
    const result = await Employee.findAndCountAll(
      {
        where:{
          [Op.not]: [{ role: ['1', req.user.role] }],
          [Op.or]: [
            {
              emp_id: {
                [Op.like]: `%${q}%`,
              },
            },
            {
              phone: {
                [Op.like]: `%${q}%`,
              },
            },
            {
              email: {
                [Op.like]: `%${q}%`
              }
            },
            {
              name: {
                [Op.like]: `%${q}%`
              }
            },
           
          ]
        },
        offset:offset,
        limit:limit
      }
      // title LIKE 'Boat%' OR description LIKE '%boat%'
    )
   res.json(result)
  }catch(err){
    console.error(err)
    res.json(err)
  }
}
module.exports = {
  insertEmployee,
  login,
  auth,
  employeeinfo,
  allEmployee,
  changePassword,
  updateAcitveEmployee,
  updateEmployee,
  profile,
  updateProfile,
  searchBar,

}

