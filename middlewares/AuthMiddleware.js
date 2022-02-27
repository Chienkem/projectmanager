const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.headers['x-access-token']
  console.log(req.headers)
  if (!accessToken) return res.json({ error: "User not logged in!" });

  try {
    const validToken = verify(accessToken, "importantsecret");
    req.user = validToken;
    if (validToken) {
      return next();
    }
    else{
      return res.json({ error: "Token Không Hợp Lệ"})
    }
  } catch (error) {
    return res.json({ error: error });
  }
};
const verifyTokenAndAuthorizationManager = (req,res,next)=>{
  validateToken(req,res,()=>{
    const role =req.user.role
    if (role==='2' || role==="1") {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  })
}

const verifyTokenAndAuthorizationProjectManager = (req,res,next)=>{
  validateToken(req,res,()=>{
    const role =req.user.role
    if (role==='3' ||role==="2" || role==="1") {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  })
}

const verifyTokenAndAuthorizationAdmin = (req,res,next)=>{
  validateToken(req,res,()=>{
    const role =req.user.role
    if ( role==="1") {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  })
}




module.exports = {
  validateToken,
  verifyTokenAndAuthorizationAdmin,
  verifyTokenAndAuthorizationProjectManager,
  verifyTokenAndAuthorizationManager
};


