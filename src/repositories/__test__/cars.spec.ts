import { Car } from "../../models/entity/car";
import CarsRepository from "../carsRepo";

describe("GET Cars", () => {
    it("should return a car data", async () => {
  
      const carToCreate: Car = {
        id: 1,
        car_name: "coba test",
        car_categories: 'tes',
        car_size: "Large",
        status_rental: 'test',
        car_img: "createcar.jpg",
      };
      const createdCar = await CarsRepository.createCar(carToCreate);
  
      const getCar = await CarsRepository.getCarsById(createdCar.id as number);
  
      await CarsRepository.deleteCarById(createdCar.id as number, 2);
  
      
      expect(getCar[0].id).toEqual(createdCar.id);
      expect(getCar[0].car_name).toEqual(carToCreate.car_name);
      expect(getCar[0].car_categories).toEqual(carToCreate.car_categories);
      expect(getCar[0].status_rental).toEqual(carToCreate.status_rental);
      expect(getCar[0].car_img).toEqual(carToCreate.car_img);
      expect(getCar[0].car_size).toEqual(carToCreate.car_size);
    });
  });

  describe("POST Cars", () => {
    it("should create a new car", async () => {
  
      const carToCreate: Car = {
        car_name: "New Car",
        car_categories: 'test',
        car_size: "test",
        status_rental: 'test',
        car_img: "createcar.jpg",
      };
  
      const createdCar = await CarsRepository.createCar(carToCreate);
  
      
      expect(createdCar).toBeDefined();
      expect(createdCar.id).toBeDefined();
      expect(createdCar.car_name).toEqual(carToCreate.car_name);
      expect(createdCar.car_categories).toEqual(carToCreate.car_categories);
      expect(createdCar.car_size).toEqual(carToCreate.car_size);
      expect(createdCar.status_rental).toEqual(carToCreate.status_rental);
      expect(createdCar.car_img).toEqual(carToCreate.car_img);
  
      
      await CarsRepository.deleteCarById(createdCar.id as number, 2);
    });
  });

  describe("PATCH Cars", () => {
    it("should update an existing car", async () => {
  
      // Assuming a car already exists in the database
      const existingCar: Car = {
        car_name: "Existing Car",
        car_categories: 'test',
        car_size: "Small",
        status_rental: 'test',
        car_img: "createcar.jpg",
      };
  
      const createdCar = await CarsRepository.createCar(existingCar);
  
      // Update the existing car
      const updatedCarData: Car = {
        car_name: "test2",
        car_categories: 'test2',
        car_size: "Small2",
        status_rental: 'test2',
        car_img: "createcar2.jpg",
      };
  
      const updatedCar = await CarsRepository.updateCarById(
        createdCar.id as number,
        updatedCarData
      );
      const fetchedUpdatedCar = await CarsRepository.getCarsById(
        createdCar.id as number
      );
  
      
      expect(fetchedUpdatedCar).toBeDefined();
      expect(fetchedUpdatedCar[0].id).toEqual(createdCar.id);
      expect(fetchedUpdatedCar[0].car_name).toEqual(updatedCarData.car_name);
      expect(fetchedUpdatedCar[0].car_categories).toEqual(updatedCarData.car_categories);
      expect(fetchedUpdatedCar[0].status_rental).toEqual(updatedCarData.status_rental);
      expect(fetchedUpdatedCar[0].car_size).toEqual(updatedCarData.car_size);
      expect(fetchedUpdatedCar[0].car_img).toEqual(updatedCarData.car_img);
  
      
      await CarsRepository.deleteCarById(updatedCar?.id as number, 2);
    });
  });

  describe("DELETE Cars", () => {
    it("should delete an existing car", async () => {
  
      
      const carToDelete: Car = {
        car_name: "coba test",
        car_categories: 'tes',
        car_size: "Large",
        status_rental: 'test',
        car_img: "createcar.jpg",
      };
  
      const createdCar = await CarsRepository.createCar(carToDelete);
  
      
      const deletedCar = await CarsRepository.deleteCarById(
        createdCar.id as number, 26
      );
  
      
      expect(deletedCar).toBeDefined();
  
      
      
    });
  });