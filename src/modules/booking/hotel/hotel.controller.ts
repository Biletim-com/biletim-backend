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
import { RatehawkHotelService } from './services/ratehawk/hotel-ratehawk.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HotelSearchQueryDto } from './dto/hotel-search.dto';
import { searchReservationByRegionIdRequestDto } from './dto/hotel-search-reservation-by-region-id.dto';
import { SearchReservationsHotelsRequestDto } from './dto/hotel-search-reservations-hotels.dto';
import { SearchReservationByHotelRequestDto } from './dto/hotel-search-reservation-hotel.dto';
import { PrebookRequestDto } from './dto/hotel-prebook.dto';
import { OrderBookingFormRequestDto } from './dto/hotel-order-booking-form.dto';
import { CreditCardDataTokenizationRequestDto } from './dto/hotel-credit-card-data-tokenization.dto';
import { BookingFinishRequestDto } from './dto/hotel-booking-finish.dto';
import { OrderBookingFinishStatusRequestDto } from './dto/hotel-order-booking-finish-status.dto';
import { WebhookRequestDto } from './dto/hotel-webhook.dto';
import { OrderTotalInformationRequestDto } from './dto/hotel-order-total-information.dto';
import { HotelOrderCancelRequestDto } from './dto/hotel-order-cancel.dto';
import { GetHotelsByIdsDto } from './dto/hotel-get-by-ids-from-db.dto';
import { HotelService } from './services/hotel.service';
import { HotelDocument } from './models/hotel.schema';
import { HotelAutocompleteSearchResponse } from './types/hotel-autocomplate-search.type';
import { HotelErrorsResponse } from './types/hotel-errors.type';
import { HotelSearchReservationByRegionIdResponse } from './types/hotel-search-reservation-by-region-id.type';
import { HotelsSearchReservationsResponse } from './types/hotel-search-reservations-hotels.type';
import { HotelPrebookResponse } from './types/hotel-prebook.type';
import { HotelOrderBookingFormResponse } from './types/hotel-order-booking-form.type';

@ApiTags('Hotel')
@Controller('hotel')
export class HotelController {
  constructor(
    private readonly ratehawkHotelService: RatehawkHotelService,
    private readonly hotelService: HotelService,
  ) {}

  @ApiOperation({ summary: 'Find Hotel Or Hotels By Id From Mongodb' })
  @Get('/find/hotels-by-ids')
  async findHotelsByIds(
    @Query() { ids }: GetHotelsByIdsDto,
  ): Promise<Partial<HotelDocument>[] | HotelDocument> {
    if (ids.length === 1) {
      return this.hotelService.findHotelById(ids[0]);
    }
    return this.hotelService.findHotelsByIds(ids);
  }

  @ApiOperation({ summary: 'Search Autocomplete' })
  @Get('/search')
  async search(
    @Query() autocompleteRequestDto: HotelSearchQueryDto,
  ): Promise<HotelAutocompleteSearchResponse | HotelErrorsResponse> {
    const { query, language } = autocompleteRequestDto;
    return this.ratehawkHotelService.search(query, language);
  }

  @ApiOperation({ summary: 'Search Reservation By Region Id' })
  @Post('/search/reservation-by-region')
  async searchReservationByRegionId(
    @Body()
    searchHotelsDto: searchReservationByRegionIdRequestDto,
  ): Promise<HotelSearchReservationByRegionIdResponse | HotelErrorsResponse> {
    return this.ratehawkHotelService.searchReservationByRegionId(
      searchHotelsDto,
    );
  }

  @ApiOperation({
    summary: 'Search Reservation By Hotel Ids  For One and More Hotels',
  })
  @Post('/search/reservation-hotels-by-ids')
  async searchReservationsHotels(
    @Body() searchReservationsHotelsDto: SearchReservationsHotelsRequestDto,
  ): Promise<HotelsSearchReservationsResponse | HotelErrorsResponse> {
    return this.ratehawkHotelService.searchReservationsHotels(
      searchReservationsHotelsDto,
    );
  }

  @ApiOperation({
    summary: 'Search Reservation By Hotel Id  For Just One Hotel',
  })
  @Post('/search/reservation-hotel-page')
  async searchReservationByHotelId(
    @Body() searchReservationByHotelDto: SearchReservationByHotelRequestDto,
  ): Promise<any> {
    return this.ratehawkHotelService.searchReservationByHotelId(
      searchReservationByHotelDto,
    );
  }

  @ApiOperation({
    summary: 'Availability Query of The Selected Hotel Room (Prebook)',
  })
  @Post('/order/prebook')
  async prebook(
    @Body() prebookDto: PrebookRequestDto,
  ): Promise<HotelPrebookResponse | HotelErrorsResponse> {
    return this.ratehawkHotelService.prebook(prebookDto);
  }

  @ApiOperation({
    summary:
      'Order Booking Form For Saving the Reservation Request to The System',
  })
  @Post('/order/booking-form')
  async orderBookingForm(
    @Query('currency_code') currency_code: string,
    @Body() orderBookingFormDto: OrderBookingFormRequestDto,
    @Req() req: any,
  ): Promise<HotelOrderBookingFormResponse | HotelErrorsResponse> {
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
      const orderBookingForm = await this.ratehawkHotelService.orderBookingForm(
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
    @Body() creditCardDataTokenizationDto: CreditCardDataTokenizationRequestDto,
  ): Promise<any> {
    return this.ratehawkHotelService.creditCardDataTokenization(
      creditCardDataTokenizationDto,
    );
  }

  @ApiOperation({
    summary: 'Order Booking Finish',
  })
  @Post('/order/booking-finish')
  async orderBookingFinish(
    @Body() bookingFinishDto: BookingFinishRequestDto,
  ): Promise<any> {
    try {
      const orderBookingFinish =
        await this.ratehawkHotelService.orderBookingFinish(bookingFinishDto);
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
  async orderBookingFinishStatus(
    @Body()
    requestDto: OrderBookingFinishStatusRequestDto,
  ): Promise<any> {
    return this.ratehawkHotelService.orderBookingFinishStatus(requestDto);
  }

  @Post('/order/webhook')
  async handleWebhook(@Body() webhookDto: WebhookRequestDto): Promise<any> {
    return this.ratehawkHotelService.handleWebhook(webhookDto);
  }

  @ApiOperation({
    summary: 'Order Information',
  })
  @Post('/order/info')
  async orderInfo(
    @Body() orderTotalInformationDto: OrderTotalInformationRequestDto,
  ): Promise<any> {
    return this.ratehawkHotelService.orderInfo(orderTotalInformationDto);
  }

  @ApiOperation({
    summary: 'Order Cancellation',
  })
  @Post('/order/cancel')
  async orderCancellation(
    @Body() partner_order_id: HotelOrderCancelRequestDto,
  ): Promise<any> {
    try {
      const orderCancel = await this.ratehawkHotelService.orderCancellation(
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
      const invoice = await this.ratehawkHotelService.downloadInfoInvoice(
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
