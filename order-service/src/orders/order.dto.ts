import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class OrderDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  productName!: string;

  @IsNumber()
  quantity!: number;
}
