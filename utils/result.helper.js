const generateToken = require('./generateToken.helper');

// For update and delete response status
const mutationStatus = (result, res) => {
  if (result.recordset[0].status === 2) {
    return res.status(409).json(result.recordset);
  }
  if (result.recordset[0].status === 0) {
    return res.status(204).json(result.recordset);
  }

  return res.status(200).json(result.recordset);
};

//for create response status

const createStatus = (result, res) => {
  if (result.recordset[0].status === 2) {
    return res.status(409).json(result.recordset);
  }
  return res.status(201).json(result.recordset);
};

// for get response Code

const getStatus = (result, res) => {
  if (result.recordset.length === 0) {
    return res.status(204).send();
  }
  return res.status(200).json(result.recordset);
};

// for get response Code
const getStatusById = (result, res) => {
  if (result.recordset.length === 0) {
    return res.status(204).send();
  }
  return res.status(200).json(result.recordset[0]);
};
// for auth response status

const authStatus = (result, res) => {
  // if (result.recordset[0].status == 0) {
  if (result.status == 0) {
    return res.status(401).json({ data: result });
  }
  return res.status(200).json({
    data: result,
  });
};

module.exports = {
  mutationStatus,
  createStatus,
  getStatus,
  getStatusById,
  authStatus,
};
