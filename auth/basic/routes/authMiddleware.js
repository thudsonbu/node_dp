
module.exports = {

  isAuth( req, res, next ) {

    if ( req.isAuthenticated ) {
      next();
    } else {
      res.status( 401 ).json({ msg: 'Unauthorized' });
    }

  },


  isAdmin( req, res, next ) {

    if ( req.user.admin ) {
      next();
    } else {
      res.status( 401 ).json({ msg: 'Insufficient Permissions' });
    }

  }
};
