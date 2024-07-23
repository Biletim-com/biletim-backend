import { Response } from 'express';
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
  OrderBookingFormDto,
  PartnerDto,
  PrebookDto,
  QueryDto,
  AutocompleteDto,
  HotelDetailsDto,
  SearchReservationByHotelDto,
  searchReservationByRegionIdDto,
  OrderTotalInformationDto,
  SearchReservationsHotelsDto,
  CreditCardDataTokenizationDto,
  WebhookDto,
} from './dto/hotel.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Hotel')
@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @ApiOperation({ summary: 'Search Autocomplete' })
  @Post('/search/autocomplete')
  async search(@Body() autocompleteDto: AutocompleteDto): Promise<any> {
    const { query, language } = autocompleteDto;
    return this.hotelService.search(query, language);
  }

  @ApiOperation({ summary: 'Search Reservation By Region Id' })
  @Post('/search/reservation-by-region')
  async searchReservationByRegionId(
    @Body() searchHotelsDto: searchReservationByRegionIdDto,
    @Query() queryDto: QueryDto,
  ): Promise<any> {
    console.log('CONTROLLER STARTED');
    return this.hotelService.searchReservationByRegionId(
      searchHotelsDto,
      queryDto,
    );
  }

  @ApiOperation({
    summary: 'Search Reservation By Hotel Ids  For One and More Hotels',
  })
  @Post('/search/reservation-hotels-pages')
  async searchReservationsHotels(
    @Body() searchReservationsHotelsDto: SearchReservationsHotelsDto,
  ): Promise<any> {
    return this.hotelService.searchReservationsHotels(
      searchReservationsHotelsDto,
    );
  }

  @ApiOperation({
    summary: 'Search Reservation By Hotel Id  For Just One Hotel',
  })
  @Post('/search/reservation-hotel-page')
  async searchReservationByHotelId(
    @Body() searchReservationByHotelDto: SearchReservationByHotelDto,
  ): Promise<any> {
    return this.hotelService.searchReservationByHotelId(
      searchReservationByHotelDto,
    );
  }

  @ApiOperation({ summary: 'Search Details Page of Hotel By Hotel Id' })
  @Post('/search/hotel-details')
  async hotelDetails(@Body() hotelDetailsDto: HotelDetailsDto): Promise<any> {
    const { id, language } = hotelDetailsDto;
    return this.hotelService.hotelDetails(id, language);
  }

  @ApiOperation({
    summary: 'Availability Query of The Selected Hotel Room (Prebook)',
  })
  @Post('/order/prebook')
  async prebook(@Body() prebookDto: PrebookDto): Promise<any> {
    return this.hotelService.prebook(prebookDto);
  }

  @ApiOperation({
    summary:
      'Order Booking Form For Saving the Reservation Request to The System',
  })
  @Post('/order/booking-form')
  async orderBookingForm(
    @Query('currency_code') currency_code: string,
    @Body() orderBookingFormDto: OrderBookingFormDto,
    @Req() req: any,
  ): Promise<any> {
    if (currency_code !== currency_code.toUpperCase() || !currency_code) {
      throw new HttpException(
        'currency_code is required and must be uppercase',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!req.ip) {
      throw new HttpException(
        'Request ip  is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const orderBookingForm = await this.hotelService.orderBookingForm(
        currency_code,
        orderBookingFormDto,
        req.ip,
      );
      return orderBookingForm;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({
    summary: 'Credit Card Data Tokenization',
  })
  @Post('/order/credit-card-tokenization')
  async creditCardDataTokenization(
    @Body() creditCardDataTokenizationDto: CreditCardDataTokenizationDto,
  ): Promise<any> {
    return this.hotelService.creditCardDataTokenization(
      creditCardDataTokenizationDto,
    );
  }

  @ApiOperation({
    summary: 'Order Booking Finish',
  })
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

  @ApiOperation({
    summary: 'Order Booking Finish Status',
  })
  @Post('/order/booking-finish-status')
  async orderBookingFinishStatus(@Body() partnerDto: PartnerDto): Promise<any> {
    return this.hotelService.orderBookingFinishStatus(partnerDto);
  }

  @Post('/order/webhook')
  async handleWebhook(@Body() webhookDto: WebhookDto): Promise<any> {
    return this.hotelService.handleWebhook(webhookDto);
  }

  @ApiOperation({
    summary: 'Order Information',
  })
  @Post('/order/info')
  async orderInfo(
    @Body() orderTotalInformationDto: OrderTotalInformationDto,
  ): Promise<any> {
    return this.hotelService.orderInfo(orderTotalInformationDto);
  }

  @ApiOperation({
    summary: 'Order Cancellation',
  })
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

  @ApiOperation({
    summary: 'Download Info Invoice',
  })
  @Get('/download/info-invoice')
  async downloadInfoInvoice(
    @Query('partner_order_id') partner_order_id: string,
    @Res() res: Response,
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

  // @Post('all-hotels')
  // async fetchAllHotels(
  //   @Body('inventory') inventory: string,
  //   @Body('language') language: string,
  // ): Promise<any> {
  //   try {
  //     const result = await this.hotelService.allHotels(inventory, language);
  //     return result;
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}
