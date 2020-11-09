/* eslint-disable no-throw-literal */
const jwt = require('jsonwebtoken');

const isValidHostName = (req, res, next) => {
  //Si tuviera que validar varios host, se puede generar un array
  const validHosts = ['dina.ec', 'localhost'];
  if (validHosts.includes(req.hostname)) {
    next();
  } else {
    res.status(403).send({ status: 'ACCESS_DENIED' });
  }
};

const isAuth = (req, res, next) => {
  try {
    const { token } = req.headers;
    if (token) {
      //confirmar que es un token valido
      const data = jwt.verify(token, process.env.JWT_SECRET);

      /* //Puede actualizar el propietario de la cuenta o un admin
      if (data.userId !== req.body.userId && data.role !== 'admin') {
        throw {
          code: 403,
          status: 'ACCESS_DENIED',
          message: 'Missing permission or invalid role',
        };
      } */

      //Solo puede actualizar el propietario de la cuenta
      //sessionData es un nombre personalizado
      req.sessionData = { userId: data.userId, role: data.role };
      next();
    } else {
      //Excepcion personalizada
      throw {
        code: 403,
        status: 'ACCESS_DENIED',
        message: 'Missing header token',
      };
    }
  } catch (error) {
    res
      .status(error.code || 500)
      .send({ status: error.status || 'ERROR', message: error.message });
  }
};

const isAdmin = (req, res, next) => {
  try {
    const { role } = req.sessionData;
    if (role !== 'admin') {
      throw {
        code: 403,
        status: 'ACCESS_DENIED',
        message: 'invalid_role',
      };
    }
    next();
  } catch (error) {
    res
      .status(error.code || 500)
      .send({ status: error.status || 'ERROR', message: error.message });
  }
};

module.exports = { isValidHostName, isAuth, isAdmin };
