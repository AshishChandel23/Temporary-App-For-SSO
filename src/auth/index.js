import express from 'express';
import passport from 'passport';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/login', passport.authenticate('login'), (req, res) => {
    res.status(200).json({ error: false, redirectUrl: req.user.redirectUrl });
});

router.get('/callback', passport.authenticate('callback', {
    //dont redirect to dashboard directly because of token
    // successRedirect:'/dashboard',
    failureRedirect: '/home',
}), (req, res) => {
    // console.log("token ::>>", req.user.token);
    const token = JWT.sign(req.user, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });
    return res.redirect(`/dashboard?token=${token}`);
});

router.get('/logout', passport.authenticate('logout'), (req, res) => {
  const message = req.user.message; // Store the message before logging out
  req.logout((err) => {
      if (err) {
          console.log("logout error:: >>", err);
          return res.status(500).json({ error: true, message: 'Logout failed' });
      }
      res.status(200).json({ error: false, message });
  });
});



  // router.get('/login', (req, res) => {
  //   const authUrl = `${process.env.IDP_AUTH_SERVER_URL}/authorize?response_type=code&client_id=${process.env.IDP_CLIENT_ID}&redirect_uri=${process.env.IDP_REDIRECT_URI}&scope=openid profile email&state=xyz`;
  //   return res.status(200).json({
  //       error:false,
  //       redirectUrl:authUrl
  //   });
  // });

  // router.get('/callback', async (req, res, next) => {
  //   const { code, state } = req.query;
  //   try {
  //     const tokenResponse = await axios.post(`${process.env.IDP_AUTH_SERVER_URL}/token`, {
  //       grant_type: 'authorization_code',
  //       code,
  //       redirect_uri: process.env.IDP_REDIRECT_URI,
  //       client_id: process.env.IDP_CLIENT_ID,
  //       client_secret: process.env.IDP_CLIENT_SECRET,
  //     }, {
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //     });
      
  //     const { access_token } = tokenResponse.data;
  
  //     const userInfoResponse = await axios.get(`${process.env.IDP_AUTH_SERVER_URL}/profile`, {
  //       headers: { Authorization: `Bearer ${access_token}` },
  //     });
  //     const token = JWT.sign(userInfoResponse.data, process.env.JWT_SECRET_KEY, {expiresIn:'2h'});
  //     return res.status(200).redirect('/dashboard?token='+token);
  //   } catch (error) {
  //       console.log("Callback Error ::>>", error);
  //     next(error);
  //   }
  // });

  // router.get('/logout', async(req, res, next)=>{
  //   try {
  //       const {data} = await axios.get(`${process.env.IDP_AUTH_SERVER_URL}/logout`);
  //       return res.status(200).json({
  //         error:false,
  //         message:data.message
  //       })
  //   } catch (error) {
  //     console.log("logout Error ::>>", error);
  //   }
  // })


export default router;