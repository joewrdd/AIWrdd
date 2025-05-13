import { IsString, IsEmail, IsNotEmpty, MinLength } from "class-validator";

//----- Create User DTO -----//
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
