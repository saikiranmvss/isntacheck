const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors({
  origin: 'https://test-235b1.web.app' // or use '*' to allow all origins
}));

const instagramClientId = '1421335018587943';
const instagramClientSecret = '293ef37b66b6d7157db8a99c2fa584d0';
const redirectUri = 'https://test-235b1.web.app/fbauth';

app.post('/exchange-code', async (req, res) => {
  const { code } = req.body;
  const tokenUrl = 'https://api.instagram.com/oauth/access_token';
  
  try {
    const tokenResponse = await axios.post(tokenUrl, new URLSearchParams({
      client_id: instagramClientId,
      client_secret: instagramClientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code
    }));

    const accessToken = tokenResponse.data.access_token;
    const userId = tokenResponse.data.user_id;
console.log('user_id'+userId);
    // Now fetch additional user details using the access token and user ID
    const userDetailsUrl = `https://graph.instagram.com/${userId}?fields=id,username,media_count&access_token=${accessToken}`;
    const userDetailsResponse = await axios.get(userDetailsUrl);

    // Combine user details with access token info and send it back to the client
    res.json({
      accessToken,
      userDetails: userDetailsResponse.data
    });
  } catch (error) {
    console.error('Error fetching access token or user details:', error);
    res.status(500).send('Failed to fetch access token or user details');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
