// import poolRedis from "../../config/redis";
import { Car, CarEntity } from "../models/entity/car";
import { CarRequest } from "../models/dto/car";

class CarsRepository {
  static async getCarsReady(): Promise<Car[]> {
    const listCar = await CarEntity.query()
      .where("status_rental", "ready")
      .select();

    return listCar;
  }
  async getCars(): Promise<Car[]> {
    const listCar = await CarEntity.query()
      .withGraphFetched("[created_by,updated_by,deleted_by]")
      .whereNull("delete_at");
    return listCar;
  }

  static async getCarsById(queryId: number): Promise<Car[]> {
    const listCarById = await CarEntity.query().where("id", queryId);
    return listCarById;
  }

  static async createCar(car: Car): Promise<Car> {
    const createdCar = await CarEntity.query().insert({
      car_name: car.car_name,
      car_categories: car.car_categories,
      car_size: car.car_size,
      status_rental: car.status_rental,
      car_img: car.car_img,
      create_by: car.create_by,
      create_at: car.create_at,
    });

    return createdCar;
  }

  static async updateCarById(
    queryId: number,
    car: CarRequest
  ): Promise<Car | null> {
    const updateCar = await CarEntity.query().findById(queryId).whereNull("delete_at");

    if (updateCar) {
      await CarEntity.query().findById(queryId).patch({
        car_name: car.car_name,
        car_categories: car.car_categories,
        car_size: car.car_size,
        status_rental: car.status_rental,
        car_img: car.car_img,
        update_by: car.update_by,
        update_at: car.update_at,
      });
      return updateCar;
    } else {
      return null;
    }
  }

  static async deleteCarById(queryId: number, deleted_by: number): Promise<Car | null> {
    const deletedCar = await CarEntity.query().findById(queryId).whereNull("delete_at");

    if (deletedCar) {
      await CarEntity.query().findById(queryId).patch({
        delete_by: deleted_by,
        delete_at: new Date(),
      });
      return deletedCar;
    } else {
      return null;
    }
  }

  // static async setCarCache(car: Car[]): Promise<void> {
  //   const redisPool = await poolRedis.createClient()
  //     .on("error", (err) => console.log("Redis Client Error", err))
  //     .connect();

  //   await redisPool.SET("car", JSON.stringify(car));
  // }

  // static async getCarCache(): Promise<Car[]> {
  //   const redisPool = await poolRedis.createClient()
  //     .on("error", (err) => console.log("Redis Client Error", err))
  //     .connect();

  //   const categoryListString = await redisPool.GET("car");
  //   let carList: Car[] = [];

  //   if (categoryListString) {
  //       carList = JSON.parse(categoryListString);
  //   }

  //   return carList;
  // }
}

export default CarsRepository;
