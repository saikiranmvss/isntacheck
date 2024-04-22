const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
  origin: 'https://test-235b1.web.app'  // Adjust according to your front-end URL
}));

const instagramClientId = '1421335018587943';
const instagramClientSecret = '293ef37b66b6d7157db8a99c2fa584d0';
const redirectUri = 'https://test-235b1.web.app/fbauth';

app.post('/exchange-code', async (req, res) => {
  const { code } = req.body;
  const tokenUrl = 'https://api.instagram.com/oauth/access_token';

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(tokenUrl, new URLSearchParams({
      client_id: instagramClientId,
      client_secret: instagramClientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code
    }));

    const accessToken = tokenResponse.data.access_token;
    const userId = tokenResponse.data.user_id;

    // Fetch user details using the Graph API
    const apiVersion = 'v19.0';  // Ensure you're using the correct API version
    const fields = 'id,username,account_type,media_count';
    const userDetailsUrl = `https://graph.instagram.com/${apiVersion}/${userId}?fields=${fields}&access_token=${accessToken}`;

    const userDetailsResponse = await axios.get(userDetailsUrl);

    // Send user details back to the client
    res.json({
      accessToken: accessToken,
      userDetails: userDetailsResponse.data
    });
  } catch (error) {
    console.error('Error fetching access token or user details:', error);
    res.status(500).send({
      message: 'Failed to fetch access token or user details',
      error: error.response ? error.response.data : error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
