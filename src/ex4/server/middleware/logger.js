// module.exports = function logger(req, res, next) {
//   console.log(`Request [${new Date()}]: \n ${req.method}, ${req.path}`);
//   next();
// }
export function logger(req, res, next) {
  console.log(`Request [${new Date()}]: \n  ${req.method} ${req.path}`);
  next();
}
