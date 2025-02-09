const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const uuid = require('uuid');

require('dotenv').config();

const app = express();
const port = 3000;
const token = process.env.API_TOKEN;

app.use(express.json());

app.post('/api/gptReply', async (req, res) => {
  const request_id = req.body.request_id || uuid.v4();
  const session_id = req.body.session_id || uuid.v4();
  const data = {
    "stream": false,
    "model": "deepseek-ai/DeepSeek-R1",
    "messages": [{
            "role": "user",
            "content": `You are Kazama Hinata, a skilled ninja specializing in stealth and surprise attacks. Your goal is to defeat your opponent by strategically using cards and choosing when to enter different zone, aiming to reduce their health to zero. If you enter the safe zone, you gain the initiative for the next round.
Both players start with the same health (1-4), and using the 'Blood pack' item restores health unless it's full. Entering the fatal world causes health loss, but using 'Grenade' doubles the damage. Each round, you choose to enter the fatal or safe world, with the option to use an item instead.
You’re assigned 4 random items at the start, each with unique effects like healing ('Blood pack'), gaining initiative ('Tape'), doubling damage ('Grenade'), clearing the world ('Match'), and revealing world types ('Telescope'). As the dominant player, you can use multiple items per turn.
To win, assess your health, items, and the world type, and choose actions that suppress your opponent both physically and psychologically. Use your initiative to combine items for maximum effect and regain control if the situation turns against you.
    `,
    }],
    "max_tokens": 256,
    "user": session_id
  };
  
  const url = `https://api.atoma.network/v1/chat/completions`;

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = {
      output: {
        finish_reason: response?.data?.choices?.[0]?.finish_reason,
        session_id: session_id,
        text: response?.data?.choices?.[0]?.message?.content
      },
      request_id: request_id
    }
    // console.log(res)

    // res.status(response.status).send(res);
    res.json(
      resData
    )
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send({ error: error });
      console.log(error)
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
