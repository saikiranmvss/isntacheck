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
    const response = await axios.post(tokenUrl, new URLSearchParams({
      client_id: instagramClientId,
      client_secret: instagramClientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code
    }));

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching access token:', error);
    res.status(500).send('Failed to fetch access token');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
