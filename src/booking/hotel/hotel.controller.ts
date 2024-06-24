import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import {
  BookingFinishDto,
  HotelPageDto,
  OrderBookingFormDto,
  PartnerDto,
  PrebookDto,
  QueryDto,
  ResultHotelsDetailsDto,
  SearchHotelsDto,
  CreditCardDataTokenizationDto,
  WebhookDto,
  OrderInformationTotalDto,
} from './dto/hotel.dto';
import { FastifyReply } from 'fastify';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post('/search/autocomplete')
  async search(
    @Body('query') query: string,
    @Body('language') language: string,
  ): Promise<any> {
    return this.hotelService.search(query, language);
  }

  @Post('/search/features-info')
  async hotelInfo(@Body() body: any): Promise<any> {
    try {
      const id = body.id;
      const language = body.language;
      const hotelDetails = await this.hotelService.hotelInfo(id, language);
      return hotelDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/search/reservation-page-details')
  async hotelPageDetails(@Body() hotelPageDto: HotelPageDto): Promise<any> {
    try {
      const hotelDetails = await this.hotelService.hotelPageDetails(
        hotelPageDto,
      );
      return hotelDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/search/result-hotels-details')
  async resultHotelsDetails(
    @Body() resultHotelsDetails: ResultHotelsDetailsDto,
  ): Promise<any> {
    try {
      const hotelsDetails = await this.hotelService.resultHotelsDetails(
        resultHotelsDetails,
      );
      return hotelsDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/search/reservation-by-region')
  async searchHotels(
    @Body() searchHotelsDto: SearchHotelsDto,
    @Query() queryDto: QueryDto,
  ): Promise<any> {
    try {
      const hotelDetails = await this.hotelService.searchHotels(
        searchHotelsDto,
        queryDto,
      );
      return hotelDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/order/prebook')
  async prebook(@Body() prebookDto: PrebookDto): Promise<any> {
    try {
      const prebook = await this.hotelService.prebook(prebookDto);
      return prebook;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/order/booking-form')
  async orderBookingForm(
    @Body() orderBookingFormDto: OrderBookingFormDto,
    @Req() req: any,
  ): Promise<any> {
    try {
      const orderBookingForm = await this.hotelService.orderBookingForm(
        orderBookingFormDto,
        req,
      );
      return orderBookingForm;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/order/credit-card-tokenization')
  async creditCardDataTokenization(
    @Body() CreditCardDataTokenizationDto: CreditCardDataTokenizationDto,
  ): Promise<any> {
    try {
      const creditCardTokenization =
        await this.hotelService.creditCardDataTokenization(
          CreditCardDataTokenizationDto,
        );
      return creditCardTokenization;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/order/booking-finish')
  async orderBookingFinish(
    @Body() bookingFinishDto: BookingFinishDto,
  ): Promise<any> {
    try {
      const orderBookingFinish = await this.hotelService.orderBookingFinish(
        bookingFinishDto,
      );
      return orderBookingFinish;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/order/booking-finish-status')
  async orderBookingFinishStatus(@Body() partnerDto: PartnerDto): Promise<any> {
    try {
      const orderBookingFinishStatus =
        await this.hotelService.orderBookingFinishStatus(partnerDto);
      return orderBookingFinishStatus;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/order/webhook')
  async handleWebhook(@Body() WebhookDto: WebhookDto): Promise<any> {
    return this.hotelService.handleWebhook(WebhookDto);
  }

  @Post('/order/info')
  async orderInfo(
    @Body() orderInformationTotalDto: OrderInformationTotalDto,
  ): Promise<any> {
    try {
      const orderInfo = await this.hotelService.orderInfo(
        orderInformationTotalDto,
      );
      return orderInfo;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/order/cancel')
  async orderCancellation(@Body() partner_order_id: PartnerDto): Promise<any> {
    try {
      const orderCancel = await this.hotelService.orderCancellation(
        partner_order_id,
      );
      return orderCancel;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/download/info-invoice')
  async downloadInfoInvoice(
    @Query('partner_order_id') partner_order_id: string,
    @Res() res: FastifyReply,
  ) {
    if (!partner_order_id) {
      throw new HttpException(
        'partner_order_id is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const invoice = await this.hotelService.downloadInfoInvoice(
        partner_order_id,
      );

      try {
        const jsonResponse = JSON.parse(invoice.toString('utf8'));

        res.status(500).send({
          message: 'Failed to download voucher',
          error: jsonResponse,
        });
      } catch (e) {
        res
          .header('Content-Type', 'application/pdf')
          .header(
            'Content-Disposition',
            `attachment; filename=voucher_${partner_order_id}.pdf`,
          )
          .header('Content-Length', invoice.length.toString())
          .send(invoice);
      }
    } catch (error) {
      throw new HttpException(
        'Failed to download voucher',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
