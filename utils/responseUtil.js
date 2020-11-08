const constructResponse = (code, success, message) => {
  return {
    code,
    success,
    message,
  };
};

module.exports = { constructResponse };
