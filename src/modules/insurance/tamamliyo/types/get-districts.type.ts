export type District = {
  ilceId: number;
  ilceAdi: string;
};

export type GetDistrictsResponse = {
  success: boolean;
  data: District[];
};
