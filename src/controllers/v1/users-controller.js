const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Users = require('../../mongo/models/users');
const Products = require('../../mongo/models/products');

const expiresIn = 60 * 10; //10 minutos

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //findOne retorna el primer usuario que conicida con la busqueda
    const user = await Users.findOne({
      email,
    });
    if (user) {
      const isOk = await bcrypt.compare(password, user.password);
      if (isOk) {
        const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn }
        );
        res.send({ status: 'OK', data: { token, expiresIn } });
      } else {
        //NO tiene acceso, contraseña incorrecta
        res.status(403).send({ status: 'INVALID_PASSWORD', message: '' });
      }
      res.send({ status: 'OK', data: {} });
    } else {
      //la peticion se proceso de manera correcta pero no encontro ningun dato
      //El codigo 204 no devuelve nada
      //El 401 envia el estado
      res.status(401).send({ status: 'USER_NOT_FOUND', message: '' });
    }
  } catch (e) {
    res.status(500).send({ status: 'ERROR', message: e.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, data } = req.body;

    const hash = await bcrypt.hash(password, 15);

    /* //Guarda los datos en Mongo
    await Users.create({
      username,
      email,
      data,
      password: hash,
    }); */

    const user = new Users();
    user.username = username;
    user.email = email;
    user.password = hash;
    user.data = data;

    await user.save();

    res.send({ status: 'OK', message: 'user_created' });
  } catch (error) {
    if (error.code && error.code === 11000) {
      res
        .status(400)
        .send({ status: 'DUPLICATED_VALUES', message: error.keyValue });
      //return para que no mande otra repuesta
      return;
    }
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      throw new Error('missing_param_userId');
    }

    await Users.findByIdAndDelete(userId);

    //Elimina los productos vinculados a un usuario
    await Products.deleteMany({
      user: userId,
    });

    res.send({ status: 'OK', message: 'user_deleted' });
  } catch (error) {
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    //retorna todos los valores menos password, __v y role
    //no se puede combinar exclusiones con inclusiones. p.e --> password: 0 , role: 1
    const users = await Users.find().select({ password: 0, __v: 0, role: 0 });
    res.send({ status: 'OK', data: users });
  } catch (error) {
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, data } = req.body;
    await Users.findByIdAndUpdate(req.sessionData.userId, {
      username,
      email,
      data,
    });
    res.send({ status: 'OK', message: 'user_updated' });
  } catch (error) {
    if (error.code && error.code === 11000) {
      res
        .status(400)
        .send({ status: 'DUPLICATED_VALUES', message: error.keyValue });
      //return para que no mande otra repuesta
      return;
    }
    res.status(500).send({ status: 'ERROR', message: 'user_updated' });
  }
};

module.exports = {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  login,
};
