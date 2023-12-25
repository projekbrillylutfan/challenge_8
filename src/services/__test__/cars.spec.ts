import CarsRepository from "../../repositories/carsRepo";
import CarServices from "../carsService";

describe("GET Cars", () => {
  it("should return correct car data", async () => {
    const expectedCarsResponse = {
      cars: [
        {
          id: 1,
          car_name: "coba test",
          car_categories: "tes",
          car_size: "Large",
          status_rental: "test",
          car_img: "createcar.jpg",
          created_by: {
            id: 2,
            username: "admin",
            email: "5LsUq@example.com",
          },
          updated_by: {
            id: 2,
            username: "admin",
            email: "5LsUq@example.com",
          },
          deleted_by: {
            id: 2,
            username: "admin",
            email: "5LsUq@example.com",
          },
        },
      ],
    };

    /** creating dependency of use case */
    const mockCarsRepository = new CarsRepository();

    /** mocking needed function */
    mockCarsRepository.getCars = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedCarsResponse));

    const carsService = new CarServices(mockCarsRepository);

    const carsData = await carsService.getCars();

    expect(carsData).toEqual(expectedCarsResponse);
  });
});
