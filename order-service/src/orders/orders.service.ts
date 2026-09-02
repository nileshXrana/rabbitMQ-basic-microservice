import { Inject, Injectable } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { OrderDto } from './order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  createOrder(orderDto: OrderDto) {
    // save data to db
    const order = {
      email: orderDto.email,
      productName: orderDto.productName,
      quantity: orderDto.quantity,
    };

    // publish the order to RabbitMQ
    const channel = this.rabbitMQService.getChannel();

    channel.publish(
      'orders', // exchange name
      'order.created', // routing key
      Buffer.from(JSON.stringify(order)),
      {
        persistent: true,
      },
    );

    // return a response
    return {
      message: 'Order created successfully',
      status: 201,
      data: order,
    };
  }
}
