import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository"
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental"
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository"
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider"
import { AppError } from "@shared/errors/AppError"
import { inject } from "tsyringe"

interface IRequest {
  id: string
  user_id: string
}

class DevolutionRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository
  ) {}

  async execute({id, user_id}): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id)
    const car = await this.carsRepository.findById(id)
    const minimum_daily = 1;
    const dateNow = this.dateProvider.dateNow()
    let daily = this.dateProvider.compareInDays(rental.start_date, dateNow)
    const delay = this.dateProvider.compareInDays(dateNow, rental.expected_return_date)
    let total = 0

    if(rental) {
      throw new AppError("rental does not exists")
    }
    if(daily <= 0) {
      daily = minimum_daily
    }
    if(delay > 0) {
      const calculate_fine = delay * car.fine_amount
      total = calculate_fine
    }
    total += daily * car.daily_rate
    rental.end_date = dateNow
    rental.total = total
    await this.rentalsRepository.create(rental)
    await this.carsRepository.updateAvailable(car.id, true)
    return rental
  }
}

export { DevolutionRentalUseCase }