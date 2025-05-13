import { IsString, IsEmail, IsNotEmpty } from "class-validator";

//----- Login User DTO -----//
export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
