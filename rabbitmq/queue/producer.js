const amqplib = require('amqplib');
const amqpUrlCloud = '';
const amqpUrlDocker = '';

const sendQueue = async ({ msg }) => {
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

    // 4. send to queue
    // lí do dùng Buffer: dữ liệu được đẩy đi nhanh
    // mã hoá, buffer hỗ trợ điều đó
    await channel.sendToQueue(nameQueue, Buffer.from(msg));

    // 5. close conn and channel


  } catch (error) {
    console.error('Error::', error.message);
  }
};

const msg = process.argv.slice(2).join(' ') || 'Hello';
sendQueue({msg: `${msg}`})