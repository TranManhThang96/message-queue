const amqplib = require('amqplib');
const amqpUrlCloud = '';
const amqpUrlDocker = 'amqp://localhost:5672/';

const postVideo = async ({ msg }) => {
  try {
    // 1. create connect
    const conn = await amqplib.connect(amqpUrlCloud);

    // 2. create channel
    const channel = await conn.createChannel();

    // 3. create exchange
    const nameExchange = 'video';
    await channel.assertExchange(nameExchange, 'fanout', {
      durable: false
    });

    // 4. publish video
    await channel.publish(nameExchange, '', Buffer.from(msg));

    console.log(`Send OK:::: ${msg}`);

    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error('Error::', error.message);
  }
};

const msg = process.argv.slice(2).join(' ') || 'Hello';
postVideo({ msg: `${msg}` });