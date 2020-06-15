module.exports = {
  user: (req, res, next) => {
    if (req.session.isAuthenticated === false)
      return res.redirect(`/account/login?retUrl=${req.originalUrl}`);
    next();
  },

  teacher: (req, res, next) => {
    if(req.session.isAuthenticated === false||
      typeof(req.session.u_role) === 'undefined' || 
      req.session.u_role !== "teacher")
      return res.redirect(`/account/login?retUrl=${req.originalUrl}`);
    next();
  },

  admin: (req, res, next) => {
    if(req.session.isAuthenticated === false||
      typeof(req.session.u_role) === 'undefined' || 
      req.session.u_role !== 0)
      return res.redirect(`/account/login?retUrl=${req.originalUrl}`);
    next();
  }

}
