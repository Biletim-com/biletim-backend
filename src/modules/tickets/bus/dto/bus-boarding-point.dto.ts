import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { BoardingPoint } from '../services/biletall/types/biletall-boarding-point.type';

export class BoardingPointDto {
  @IsInt()
  @IsOptional()
  companyNo?: number;

  @IsInt()
  @IsNotEmpty()
  departurePointID!: number;

  @IsDateString(
    {},
    { message: 'Date must be in the format yyyy-MM-ddTHH:mm:ss' },
  )
  @IsNotEmpty()
  localTime!: string;

  @IsInt()
  @IsNotEmpty()
  routeNumber!: number;
}

export class BoardingPointResponseDto {
  place: string[];
  time: string[];
  visibleOnInternet: string[];

  constructor(boardingPoint: BoardingPoint) {
    this.place = boardingPoint.Yer;
    this.time = boardingPoint.Saat;
    this.visibleOnInternet = boardingPoint.Internette_Gozuksunmu;
  }

  static finalVersionBoardingPointResponse(
    boardingPoints: BoardingPoint[],
  ): BoardingPointResponseDto[] {
    return boardingPoints.map(
      (boardingPoint) => new BoardingPointResponseDto(boardingPoint),
    );
  }
}
