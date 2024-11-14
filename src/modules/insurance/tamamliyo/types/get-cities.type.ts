export type City = {
  ilId: number;
  ilAdi: string;
};

export type GetCitiesResponse = {
  success: boolean;
  data: City[];
};
