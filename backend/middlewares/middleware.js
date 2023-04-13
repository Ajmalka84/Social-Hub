const jwt = require("jsonwebtoken");

module.exports = {
  verify: (req, res, next) => {
    console.log("------------");
    const authHeader = req.headers["authorization"]; // we could also access authorization in this way too. normally used way is (req.headers.authization)

    if (authHeader) {
      const token = authHeader.split(" ")[1]; // split() splits a string into an array of substrings . it has 2 arguments . one is the seperator and the second is the limit of the array.
      if (token == null) return res.sendStatus(401);
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (error, user) => {
        if (error) {
          console.log(error, "error is here");
          return res.status(403).json("Token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("you are not authenticated");
    }
  },

  createAccessToken: (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: "60m",
    });
  },

  createRefreshToken: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY);
  },
};
