const amqplib = require('amqplib');
const amqpUrlCloud = '';
const amqpUrlDocker = 'amqp://localhost:5672/';

const sendMail = async () => {
  try {
    // 1. create connect
    const conn = await amqplib.connect(amqpUrlCloud);

    // 2. create channel
    const channel = await conn.createChannel();

    // 3. create exchange
    const nameExchange = 'send_mail';
    await channel.assertExchange(nameExchange, 'topic', {
      durable: false
    });

    const args = process.argv.slice(2);
    const msg = args[1] || 'Fixed';
    const topic = args[0];
    console.log(`msg:: ${msg}:::::topic:: ${topic}`);

    // 4. publish video
    await channel.publish(nameExchange, topic, Buffer.from(msg));

    console.log(`Send OK:::: ${msg}`);

    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error('Error::', error.message);
  }
};

sendMail();