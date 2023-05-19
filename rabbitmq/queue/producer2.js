const amqplib = require('amqplib');
const amqpUrlCloud = '';
const amqpUrlDocker = 'amqp://localhost:5672/';

const sendQueue = async ({ msg }) => {
  try {
    // 1. create connect
    const conn = await amqplib.connect(amqpUrlCloud);

    // 2. create channel
    const channel = await conn.createChannel();

    // 3. create name queue
    const nameQueue = 'q2';
    await channel.assertQueue(nameQueue, {
      durable: false  // khi start lai thi queue khong bi mat message
    });

    // 4. send to queue
    // lí do dùng Buffer: dữ liệu được đẩy đi nhanh
    // mã hoá, buffer hỗ trợ điều đó
    await channel.sendToQueue(nameQueue, Buffer.from(msg), {
      persistent: true,  // đảm bảo rằng các thông điệp (messages) được lưu trữ trên disk và không bị mất khi RabbitMQ server bị khởi động lại hoặc gặp sự cố. 
      expiration: '10000'  // => TTL time to live, trong vòng 10s đếu không có consumer nào xử lý thì message tự động bị xoá
    });

    // 5. close conn and channel


  } catch (error) {
    console.error('Error::', error.message);
  }
};

const msg = process.argv.slice(2).join(' ') || 'Hello';
sendQueue({msg: `${msg}`})