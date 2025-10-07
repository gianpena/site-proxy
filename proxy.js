const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const app = express();

let allowedOrigins = [
   'http://localhost:5173',
   'https://gianpena.xyz'
];

allowedOrigins = allowedOrigins.concat(process.argv.slice(2));

const serverPort = 3001;

app.use(cors({ 
   origin: allowedOrigins
}));

app.get('/monkeytype/:time', async (req, res) => {
  try {
      const { time } = req.params;
      const mt_time60_response = await fetch(`https://api.monkeytype.com/leaderboards/rank?language=english&mode=time&mode2=${time}`, {
              method: 'GET',
              headers: {
                      'Authorization': `ApeKey ${process.env.APE_KEY}`
              }
      });
      const mt_time60_json = await mt_time60_response.json();
      const data = mt_time60_json.data;
      const stats = `${data.wpm} (${data.acc}% accuracy, rank ${data.rank})`;
      const link = `https://monkeytype.com/profile/${data.username}`;
      return res.status(200).json({ stats, link });
  } catch (error) {
      console.error('MonkeyType API Error:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch MonkeyType data' });
  }
});

app.get('/typeracer', async (req, res) => {
   try {
       const typeracer_response = await fetch('https://www.typeracerdata.com/api/profile?username=gianthetaco');
       const typeracer_json = await typeracer_response.json();
       const stats = `${Math.round(typeracer_json.account.wpm_textbests * 100) / 100}`;
       const link = `https://monkeytype.com/profile/${data.username}`;
      return res.status(200).json({ stats, link });
   } catch (error) {
       console.error('TypeRacer API Error:', error);
       return res.status(500).json({ success: false, error: 'Failed to fetch TypeRacer data' });
   }
});

app.get('/username', async (req, res) => {
  try {
    const discord_response = await fetch('https://discord.com/api/v10/users/247492668131770369', {
      method: 'GET',
      headers: {'Authorization': `Bot ${process.env.DISCORD_TOKEN}`}
    });
    const discord_json = await discord_response.json();
    const { username } = discord_json;
    return res.status(200).json({success: true, username});
  } catch(error) {
    console.error('Discord API Error:', error);
    return res.status(500).json({success: false, error: 'Failed to fetch Discord username'});
  }
});

app.listen(serverPort, () => {
	console.log(`Listening on port ${serverPort}...`);
    console.log('Allowed origins are:');
    console.log(allowedOrigins.join('\n'));
});
