import amqp from "amqplib";
import logger from "../../logger/index.js";
import * as dotenv from "dotenv";
dotenv.config();


interface RabbitMQ {
  createConnection: () => Promise<void>;
  publishMessage: (message: string, bindingKey: string) => Promise<boolean | undefined>;
  consumeMessage: (bindingKey: string, callback: (msg: amqp.ConsumeMessage | null) => void) => void;
  closeConnection: () => Promise<void>;
}

class RabbitMsgQueue implements RabbitMQ{
  private connection: amqp.Connection | null;
  private channel: amqp.Channel | null;
  private exchange: string;

  constructor() {
    this.connection = null;
    this.channel = null;
    this.exchange =  `${process.env.EXCHANGE_NAME}` || "preordr_exchange";
  }

  // create connection

  async createConnection() {
    try {
      this.connection = await amqp.connect(`${process.env.AMQP_URL}` || "amqp://localhost");
      this.channel = await this.connection.createChannel();

    } catch (error) {
      logger.error(error);
    }
  }

  // publish message

  async publishMessage(message: string, bindingKey: string): Promise<boolean | undefined>{
    try {
      if (this.channel === null) {
        throw new Error("publish channel is not connected");
      }

      await this.channel.assertExchange(this.exchange, "direct", {
        durable: true,
      });

      const isMsgPublished = this.channel.publish(this.exchange, bindingKey, Buffer.from(message), {
        persistent: true,
      });

      return isMsgPublished;
      
    } catch (error) {
      logger.error(error);
    }
  }

  // consume message

  async consumeMessage(
    bindingKey: string,
    callback: (msg: amqp.ConsumeMessage | null) => void
  ) {
    try {
      if (this.channel === null) {
        throw new Error("consume channel is not connected");
      }

      await this.channel.assertExchange(this.exchange, "direct", {
        durable: true,
      });

      const q = await this.channel.assertQueue("", {
        exclusive: true,
        durable: true,
      });

      await this.channel.bindQueue(q.queue, this.exchange, bindingKey);

      await this.channel.consume(q.queue, (msg) => {

        if (msg !== null) {
          callback(msg);
          this.channel?.ack(msg);

        } else {
          logger.error("Consumer cancelled by server");
        }
      });

    } catch (error) {
      logger.error(error);
    }
  }

  // close connection

  async closeConnection() {
    try {
      if (this.connection === null) {
        throw new Error("RabbitMQ connection is not connected");
      }

      if(this.channel !== null) {
        await this.channel.close();
      }
      
      await this.connection.close();
    } catch (error) {
      logger.error(error);
    }
  }

}

export const instanceOfRabbitMQ = async () => {

 const instance = new RabbitMsgQueue();
 await instance.createConnection();

 return instance;
}
