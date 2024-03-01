import { IsNotEmpty,IsEmail,IsHash, IsString, MaxLength } from "class-validator";
export class CreateUserDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly cpassword: string;
}