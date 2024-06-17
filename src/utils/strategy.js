import { Strategy as CustomStrategy } from 'passport-custom';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const loginStrategy = new CustomStrategy(async (req, done) => {
  try {
    const authUrl = `${process.env.IDP_AUTH_SERVER_URL}/authorize?response_type=code&client_id=${process.env.IDP_CLIENT_ID}&redirect_uri=${process.env.IDP_REDIRECT_URI}&scope=openid profile email&state=xyz`;
    done(null, { redirectUrl: authUrl });
  } catch (error) {
    done(error);
  }
});

const callbackStrategy = new CustomStrategy(async (req, done) => {
  const { code, state } = req.query;
  try {
    const tokenResponse = await axios.post(`${process.env.IDP_AUTH_SERVER_URL}/token`, {
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.IDP_REDIRECT_URI,
      client_id: process.env.IDP_CLIENT_ID,
      client_secret: process.env.IDP_CLIENT_SECRET,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = tokenResponse.data;
    const userInfoResponse = await axios.get(`${process.env.IDP_AUTH_SERVER_URL}/profile`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    done(null, userInfoResponse.data );
  } catch (error) {
    done(error);
  }
});

const logoutStrategy = new CustomStrategy(async (req, done) => {
  try {
    const { data } = await axios.get(`${process.env.IDP_AUTH_SERVER_URL}/logout`);
    done(null, { message: data.message });
  } catch (error) {
    done(error);
  }
});

export { loginStrategy, callbackStrategy, logoutStrategy };
