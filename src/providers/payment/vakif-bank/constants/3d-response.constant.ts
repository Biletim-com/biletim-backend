export const threeDSecureResponse: Record<
  string,
  { description: string; detail?: string }
> = {
  '200': {
    description:
      'Enrollment ve Pares status değerleri Y ise başarılı. Aksi durumda doğrulama eksik.',
    detail: undefined,
  },
  '20': {
    description: 'Kart 3D Secure programına dahil değil',
    detail: 'Kart hamili bankasının çağrı merkeziyle görüşmelidir.',
  },
  '33': {
    description: 'Kartın 3D Secure doğrulaması yapılamadı',
    detail: 'Kart hamili bankasının çağrı merkeziyle görüşmelidir.',
  },
  '400': {
    description: '3D Şifre doğrulaması yapılamadı.',
    detail: undefined,
  },
  '1001': {
    description: 'System Error',
    detail: 'Sistem Hatası',
  },
  '1002': {
    description: 'Success URL format is invalid',
    detail: undefined,
  },
  '1003': {
    description: 'Brand Id format is invalid',
    detail: undefined,
  },
  '1004': {
    description: 'Device category format is invalid',
    detail: undefined,
  },
  '1005': {
    description: 'Session info format is invalid',
    detail: undefined,
  },
  '1006': {
    description: 'Xid format is invalid',
    detail: undefined,
  },
  '1007': {
    description: 'Currency format is invalid',
    detail: undefined,
  },
  '1008': {
    description: 'Purchase amount format is invalid',
    detail: undefined,
  },
  '1009': {
    description: 'Expire date format is invalid',
    detail: undefined,
  },
  '1010': {
    description: 'Pan format is invalid',
    detail: undefined,
  },
  '1011': {
    description: 'Merchant acquirer bin password format is invalid',
    detail: undefined,
  },
  '1012': {
    description: 'Host merchant format is invalid',
    detail: undefined,
  },
  '1013': {
    description: 'Bank Id format is invalid',
    detail: undefined,
  },
  '1014': {
    description: 'Is recurring format is invalid',
    detail: undefined,
  },
  '1015': {
    description: 'Recurring frequency format is invalid',
    detail: undefined,
  },
  '1016': {
    description: 'Recurring end date format is invalid',
    detail: undefined,
  },
  '1017': {
    description: 'Installment count format is invalid',
    detail: undefined,
  },
  '1018': {
    description: 'AcctId format is invalid',
    detail: undefined,
  },
  '1019': {
    description: 'Protocol format is invalid',
    detail: undefined,
  },
  '1020': {
    description: 'Acs URL format is invalid',
    detail: undefined,
  },
  '1021': {
    description: 'Error message format is invalid',
    detail: undefined,
  },
  '1022': {
    description: 'Pares cavv format is invalid',
    detail: undefined,
  },
  '1023': {
    description: 'Pares eci format is invalid',
    detail: undefined,
  },
  '1024': {
    description: 'Pares cav algorithm format is invalid',
    detail: undefined,
  },
  '1025': {
    description: 'VeRes message Id does not match VeReq message Id',
    detail: undefined,
  },
  '1026': {
    description: 'Invalid fail URL',
    detail: undefined,
  },
  '1027': {
    description: 'VeRes status format is invalid',
    detail: undefined,
  },
  '1028': {
    description: 'Veres version format is invalid',
    detail: undefined,
  },
  '1029': {
    description: 'Pares version format is invalid',
    detail: undefined,
  },
  '1030': {
    description: 'Pares acquirer bin format is invalid',
    detail: undefined,
  },
  '1031': {
    description: 'Pares merchant Id format is invalid',
    detail: undefined,
  },
  '1032': {
    description: 'Pares pan format is invalid',
    detail: undefined,
  },
  '1033': {
    description: 'Pares time format is invalid',
    detail: undefined,
  },
  '1034': {
    description: 'Pares date format is invalid',
    detail: undefined,
  },
  '1035': {
    description: 'Pares Xid format is invalid',
    detail: undefined,
  },
  '1036': {
    description: 'Pares status format is invalid',
    detail: undefined,
  },
  '1037': {
    description: 'Pares IReq format is invalid',
    detail: undefined,
  },
  '1038': {
    description: 'Pares vendor code format is invalid',
    detail: undefined,
  },
  '1039': {
    description: 'Pares exponent format is invalid',
    detail: undefined,
  },
  '1040': {
    description: 'Invalid Xid',
    detail: undefined,
  },
  '2000': {
    description: 'Acquirer info is empty',
    detail: undefined,
  },
  '2005': {
    description: 'Merchant cannot be found for this bank',
    detail: 'API şifresi ve istek URL adresi kontrol edilmeli.',
  },
  '2006': {
    description: 'Merchant acquirer bin password is required',
    detail: undefined,
  },
  '2009': {
    description: 'Brand not found',
    detail: undefined,
  },
  '2010': {
    description: 'Card holder info is empty',
    detail: undefined,
  },
  '2011': {
    description: 'Pan is empty',
    detail: undefined,
  },
  '2012': {
    description: 'Device category must be between 0 and 2',
    detail: undefined,
  },
  '2013': {
    description: 'Threed secure message cannot be found',
    detail: undefined,
  },
  '2014': {
    description: 'Pares message Id does not match threed secure message Id',
    detail: undefined,
  },
  '2015': {
    description: 'Signature verification failed',
    detail: undefined,
  },
  '2017': {
    description: 'Acquire bin cannot be found',
    detail: undefined,
  },
  '2018': {
    description: 'Merchant acquirer bin password is wrong',
    detail: undefined,
  },
  '2019': {
    description: 'Bank not found',
    detail: undefined,
  },
  '2020': {
    description: 'Bank Id does not match merchant bank',
    detail: undefined,
  },
  '2021': {
    description: 'Invalid currency code',
    detail: undefined,
  },
  '2022': {
    description: 'Verify enrollment request Id cannot be empty',
    detail: undefined,
  },
  '2023': {
    description:
      'Verify enrollment request Id already exists for this merchant',
    detail: undefined,
  },
  '2024': {
    description: 'Acs certificate cannot be found in database',
    detail: undefined,
  },
  '2025': {
    description: 'Certificate could not be found in certificate store',
    detail: undefined,
  },
  '2026': {
    description: 'Brand certificate not found in store',
    detail: undefined,
  },
  '2027': {
    description: 'Invalid XML file',
    detail: undefined,
  },
  '2028': {
    description: 'Threed secure message is in an invalid state',
    detail: undefined,
  },
  '2029': {
    description: 'Invalid pan',
    detail: undefined,
  },
  '2030': {
    description: 'Invalid expire date',
    detail: undefined,
  },
  '2031': {
    description: 'Verification failed: No signature was found in the document',
    detail: undefined,
  },
  '2032': {
    description:
      'Verification failed: More than one signature was found for the document',
    detail: undefined,
  },
  '2033': {
    description: 'Actual brand cannot be found',
    detail: undefined,
  },
  '2034': {
    description: 'Invalid amount',
    detail: undefined,
  },
  '2035': {
    description: 'Invalid recurring information',
    detail: undefined,
  },
  '2036': {
    description: 'Invalid recurring frequency',
    detail: undefined,
  },
  '2037': {
    description: 'Invalid recurring end date',
    detail: undefined,
  },
  '2038': {
    description: 'Recurring end date must be earlier than expire date',
    detail: undefined,
  },
  '2039': {
    description: 'Invalid x509 certificate data',
    detail: undefined,
  },
  '2040': {
    description: 'Invalid installment',
    detail: undefined,
  },
  '2041': {
    description: 'Pares exponent value does not match Pareq exponent',
    detail: undefined,
  },
  '2042': {
    description: 'Pares acquirer bin value does not match Pareq acquirer bin',
    detail: undefined,
  },
  '2043': {
    description: 'Pares Merchant Id does not match Pareq Merchant Id',
    detail: undefined,
  },
  '2044': {
    description: 'Pares Xid does not match Pareq Xid',
    detail: undefined,
  },
  '2045': {
    description: 'Pares purchase amount does not match Pareq purchase amount',
    detail: undefined,
  },
  '2046': {
    description: 'Pares currency does not match pareq currency',
    detail: undefined,
  },
  '2047': {
    description: 'VeRes Xsd validation error',
    detail: undefined,
  },
  '2048': {
    description: 'PaRes Xsd validation exception',
    detail: undefined,
  },
  '2049': {
    description: 'Invalid request',
    detail: undefined,
  },
  '2050': {
    description: 'File is empty',
    detail: undefined,
  },
  '2051': {
    description: 'Custom error',
    detail: undefined,
  },
  '2052': {
    description: 'Bank brand bin already exists',
    detail: undefined,
  },
  '2053': {
    description: 'Directory server communication error',
    detail: 'DS iletişiminde hata oluştu.',
  },
  '2054': {
    description: 'ACS error occurred',
    detail: 'ACS hata bildirdi.',
  },
  '2055': {
    description: 'Encryption key not found',
    detail: undefined,
  },
  '2056': {
    description: 'Hsm session not found',
    detail: undefined,
  },
  '2057': {
    description: 'Max on us brand count is one',
    detail: undefined,
  },
  '9595': {
    description: 'This record already exists',
    detail: undefined,
  },
  '9601': {
    description: 'This record does not exist',
    detail: undefined,
  },
  '3000': {
    description: 'Bank not found',
    detail: undefined,
  },
  '3001': {
    description: 'Country not found',
    detail: undefined,
  },
  '3002': {
    description: 'Invalid fail URL',
    detail: undefined,
  },
  '3003': {
    description: 'Host merchant number cannot be empty',
    detail: undefined,
  },
  '3004': {
    description: 'Merchant brand acquirer bin cannot be empty',
    detail: undefined,
  },
  '3005': {
    description: 'Merchant name cannot be empty',
    detail: undefined,
  },
  '3006': {
    description: 'Merchant password cannot be empty',
    detail: undefined,
  },
  '3007': {
    description: 'Invalid success URL',
    detail: undefined,
  },
  '3008': {
    description: 'Invalid merchant site URL',
    detail: undefined,
  },
  '3009': {
    description: 'Invalid acquirer bin length',
    detail: undefined,
  },
  '3010': {
    description: 'Brand cannot be null',
    detail: undefined,
  },
  '3011': {
    description: 'Invalid acquirer bin password length',
    detail: undefined,
  },
  '3012': {
    description: 'Invalid host merchant number length',
    detail: undefined,
  },
  '3013': {
    description: 'End date must be greater than start',
    detail: undefined,
  },
  '3014': {
    description: 'Start date must be greater than DateTime MinVal',
    detail: undefined,
  },
  '3015': {
    description: 'End date must be greater than DateTime MinVal',
    detail: undefined,
  },
  '3016': {
    description: 'Invalid search period',
    detail: undefined,
  },
  '3017': {
    description: 'Bin cannot be empty',
    detail: undefined,
  },
  '3018': {
    description: 'Card type cannot be empty',
    detail: undefined,
  },
  '3019': {
    description: 'Bank brand bin not found',
    detail: undefined,
  },
  '3020': {
    description: 'Bin length must be six',
    detail: undefined,
  },
};
