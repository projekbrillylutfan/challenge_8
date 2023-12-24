import { Request, Response } from "express";
import { DefaultResponse } from "../models/dto/default";
import { Car } from "../models/entity/car";
import { CarRequest } from "../models/dto/car";
import CarsService from "../services/carsService";
import cloudinary from "../../config/cloudinary";

class CarsHandler {
  _carsService: CarsService;

  constructor(carServices: CarsService) {
    this._carsService = carServices;

    // Bind methods, so they can access the properties
    this.getCars = this.getCars.bind(this);
    this.getCarsById = this.getCarsById.bind(this);
    this.createCar = this.createCar.bind(this);
    this.deleteCarById = this.deleteCarById.bind(this);
    this.updateCarById = this.updateCarById.bind(this);
  }
  async getCarsReady(req: Request, res: Response) {
    const carList: Car[] = await this._carsService.getCarsReady();
    console.log("isi carList", carList)

    const response: DefaultResponse = {
      status: "OK",
      message: "Sukses Menampilkan Data Mobil Ready",
      data: {
        cars: carList,
      },
    };

    res.status(200).send(response);
  }
  async getCars(req: Request, res: Response) {
    const carsList: Car[] = await this._carsService.getCars();

    const response: DefaultResponse = {
      status: "OK",
      message: "Sukses Menampilkan Data Mobil",
      data: {
        cars: carsList,
      },
    };

    res.status(200).send(response);
  }

  async getCarsById(req: Request, res: Response) {
    const queryId: number = parseInt(req.params.id);

    const carsList: Car[] = await this._carsService.getCarsById(queryId);

    if (carsList.length === 0) {
      const Response: DefaultResponse = {
        status: "ERROR",
        message: "Data Mobil Tidak Ditemukan",
        data: null,
      };
      return res.status(404).send(Response);
    }
    const response: DefaultResponse = {
      status: "OK",
      message: "Sukses Menampilkan Data Mobil",
      data: {
        cars: carsList,
      },
    };
    res.status(200).send(response);
  }

  async createCar(req: Request, res: Response) {
    const payload: CarRequest = req.body;

    const fileBase64 = req.file?.buffer.toString("base64");
    const file = `data:${req.file?.mimetype};base64,${fileBase64}`;

    const uploadedImage = await cloudinary.uploader.upload(file);

    payload.car_img = uploadedImage.secure_url;
    if (
      !(
        payload.car_name &&
        payload.car_categories &&
        payload.car_size &&
        payload.status_rental &&
        payload.car_img
      )
    ) {
      const response: DefaultResponse = {
        status: "BAD_REQUEST",
        message: "Field Tidak Boleh Kosong",
        data: {
          created_car: null,
        },
      };

      return res.status(400).send(response);
    }

    payload.create_by = req.user.id as number;

    const createdCar: Car = await this._carsService.createCar(payload);

    const response: DefaultResponse = {
      status: "CREATED",
      message: "Data Mobil Berhasil Ditambahkan",
      data: {
        created_car: createdCar,
      },
    };

    res.status(201).send(response);
  }

  async updateCarById(req: Request, res: Response) {
    const queryId: number = parseInt(req.params.id);
    const payload: CarRequest = req.body;
    payload.car_img = (req as any)["uploaded_car_img"];
    if (
      !(
        payload.car_name &&
        payload.car_categories &&
        payload.car_size &&
        payload.status_rental &&
        payload.car_img
      )
    ) {
      const response: DefaultResponse = {
        status: "BAD_REQUEST",
        message: "Field Tidak Boleh Kosong",
        data: {
          updated_car: null,
        },
      };
      res.status(400).send(response);
    }

    payload.update_by = req.user.id as number;

    const updatedCar: Car | null = await this._carsService.updateCarById(
      queryId,
      payload
    );

    if (!updatedCar) {
      const Response: DefaultResponse = {
        status: "ERROR",
        message: "Data Mobil Tidak Ditemukan",
        data: null,
      };
      return res.status(404).send(Response);
    }

    const response: DefaultResponse = {
      status: "UPDATED",
      message: "Data Mobil Berhasil Diupdate",
      data: {
        old_car: updatedCar,
        updated_car: payload,
      },
    };
    res.status(200).send(response);
  }

  async deleteCarById(req: Request, res: Response) {
    const queryId: number = parseInt(req.params.id);
    const user_id = req.user.id as number;
    const deletedCar: Car | null = await this._carsService.deleteCarById(queryId, user_id);

    if (!deletedCar) {
      const Response: DefaultResponse = {
        status: "ERROR",
        message: "Data Mobil Tidak Ditemukan",
        data: null,
      };
      return res.status(404).send(Response);
    }

    const response: DefaultResponse = {
      status: "DELETED",
      message: "Data Mobil Berhasil Dihapus",
      data: {
        deleted_car: deletedCar,
      },
    };

    res.status(200).send(response);
  }
}

export default CarsHandler;
