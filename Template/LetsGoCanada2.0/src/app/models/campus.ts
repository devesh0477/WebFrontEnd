import { City } from "./city";
import { Province } from "./province";
import { Country } from "./country";

export class Campus {

  campusId: number;
  campusName: string;
  about?: string;
  address?: string;
  campusMedia?: string;
  contacMail?: string;
  countryName?: string;
  countryId?: number;
  provinceName?: string;
  provinceId?: number;
  cityName?: string;
  cityId?: number;
  postalcode?: string;
  schoolId?: string;

  city?: City;
  province?: Province;
  country?: Country;

  constructor() { }
}


