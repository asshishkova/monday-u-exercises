function logger(req, res, next) {
  console.log(`Request [${new Date()}]: \n  ${req.method} ${req.path}`);
  next();
}

module.exports = logger;
