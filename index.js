const express = require('express');
const app = express();
const mineflayer = require('mineflayer');
const autoauth = require('mineflayer-autoauth');
const config = require('./config.json');

let bot;

app.get('/uptime', (req, res) => {
  res.status(200).send('Bot is online!');
});

app.listen(3000, () => {
  console.log('Bot is listening on port 3000');
  connectToServer();
});

function connectToServer() {
  bot = mineflayer.createBot({
    host: config.minecraft.host,
    port: config.minecraft.port,
    username: config.minecraft.username,
    auth: autoauth(config.minecraft.username)
  });

  bot.on('spawn', () => {
    console.log('Bot has spawned!');
  });

  bot.on('kicked', (reason) => {
    console.log(`Bot was kicked: ${reason}`);
    reconnectToServer();
  });

  bot.on('error', (err) => {
    console.error(err);
    reconnectToServer();
  });

  bot.on('end', () => {
    console.log('Bot disconnected');
    reconnectToServer();
  });
}

function reconnectToServer() {
  console.log('Reconnecting to server...');
  setTimeout(connectToServer, 5000); // wait 5 seconds before reconnecting
}
