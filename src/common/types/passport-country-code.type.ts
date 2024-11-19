import { passportCountryCodes } from '../constants/passport-country-codes.constant';

export type PassportCountryCode = (typeof passportCountryCodes)[number];
