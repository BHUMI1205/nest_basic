import { IsNotEmpty,IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;

}