import { IsArray, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Min } from 'class-validator';

class ParticipantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  dietaryRestrictions?: string;
}

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  tourId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  @Min(1)
  adults: number;

  @IsNumber()
  @Min(0)
  children: number;

  @IsArray()
  @IsOptional()
  addOns?: string[];

  @IsString()
  @IsOptional()
  specialRequests?: string;

  @IsString()
  @IsNotEmpty()
  contactName: string;

  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @IsPhoneNumber()
  @IsOptional()
  contactPhone?: string;

  @IsArray()
  @IsOptional()
  participants?: ParticipantDto[];
}
