const amqplib = require('amqplib');
const amqpUrlCloud = '';
const amqpUrlDocker = '';

const receiveQueue = async () => {
  try {
    // 1. create connect
    const conn = await amqplib.connect(amqpUrlCloud);

    // 2. create channel
    const channel = await conn.createChannel();

    // 3. create name queue
    const nameQueue = 'q1';
    await channel.assertQueue(nameQueue, {
      durable: false
    });

    // 4. receive to queue
    await channel.consume(nameQueue, msg => {
      console.log('Msg::', msg.content.toString());
    }, {
      noAck: false
    });

    // 5. close conn and channel


  } catch (error) {
    console.error('Error::', error.message);
  }
};

receiveQueue();