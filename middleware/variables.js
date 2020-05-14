module.exports = function(req, res, next){ // ко всем ответам сервера
  res.locals.isAuth = req.session.isAuthenticated // с каждым ответом отдаётся в шаблон 
  // isAuthenticated из auth js 
  res.locals.csrf = req.csrfToken()
  next() // а это передаётся в навбар
}