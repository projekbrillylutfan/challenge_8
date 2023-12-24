import { UserResponse } from "./user";

interface CarRequest {
  car_name: string;
  car_categories: string;
  car_size: string;
  status_rental: string;
  car_img: string;
  user_id?: number;
  create_by?: number;
  update_by?: number;
  delete_by?: number;
  create_at?: Date;
  update_at?: Date;
  delete_at?: Date;
}

interface CarResponse {
  id: number;
  car_name: string;
  car_categories: string;
  car_size: string;
  status_rental: string;
  car_img: string;
  created_by: UserResponse;
  updated_by: UserResponse;
  deleted_by: UserResponse;
  create_at?: Date;
  update_at?: Date;
  delete_at?: Date;
}

export { CarRequest, CarResponse };
