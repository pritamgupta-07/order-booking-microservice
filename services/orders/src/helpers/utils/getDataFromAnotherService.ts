import { Products } from "../../types/Products.js";
import { instanceOfRabbitMQ } from "./amqp.js";
import { parsePayload, stringifyPayload } from "./payloadWrapper.js";

interface Payload {
  messageId: string;
  event: string;
  message: object;
  queueName: string;
  replyToQueue: string;
}

interface ServiceData {
  status: boolean;
  data: {
    menu: Products[];
    error: string;
  };
}

export async function getDataFromAnotherService(payload: Payload): Promise<ServiceData> {
  return new Promise(async (resolve, reject) => {
    try {
      const { queueName, messageId, message, event, replyToQueue } = payload;
      const rabbitMQ = await instanceOfRabbitMQ();

      await rabbitMQ.consumeMessage(
        replyToQueue,
        async (msg) => {
          const data = msg?.content.toString();
          const parsedData = await parsePayload(data);
          if (parsedData.messageId === messageId) {
            resolve(parsedData);
          }
        }
      );
      await rabbitMQ.publishMessage(
        stringifyPayload({ messageId, event, message, replyToQueue }),
        queueName
      );
    } catch (error) {
      reject(error);
    }
  });
}
