const jwt = require('jsonwebtoken');
const requestHandler = require('../utils/requestHandler');

const generateToken = (res, statusCode, message, user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    name: user.fullname,
  };
  console.log('payload');
  console.log(payload);
  const options = {
    expiresIn: '1 day'
  };
  const result = jwt.sign(
    payload,
    process.env.SECRET || 'testing test',
    options
  );
  return requestHandler.success(res, statusCode, message, { token: result, name:user.fullname, role:user.role });
};

const usersToken = user => {
  const payload = {
    __uid: user.id
  };
  const options = {
    expiresIn: '1 day'
  };
  const token = jwt.sign(
    payload,
    process.env.SECRET || 'testing test',
    options
  );
  return token;
};

module.exports = { generateToken, usersToken };
