import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Seat from 'App/Models/Seat';
import SeatValidator from 'App/Validators/SeatValidator';

export default class SeatsController {

    public async find({ request, params }: HttpContextContract) {
        if (params.id) {
            let theSeat:Seat=await Seat.findOrFail(params.id);
            //Cargar la relación
            await theSeat.load("theater")
            return theSeat;
        } else {
            const data = request.all()
            if ("page" in data && "per_page" in data) {
                const page = request.input('page', 1);
                const perPage = request.input("per_page", 20);
                return await Seat.query().paginate(page, perPage)
            } else {
                return await Seat.query()
            }

        }

    }
    
    public async create({ request }: HttpContextContract) {
        // const body = request.body();
        const body = await request.validate(SeatValidator);
        const theSeat: Seat = await Seat.create(body);
        return theSeat;
    }

    public async update({ params, request }: HttpContextContract) {
        const theSeat: Seat = await Seat.findOrFail(params.id);
        const body = request.body();
        theSeat.location = body.location;
        theSeat.reclining = body.reclining;
        theSeat.theater_id = body.theater_id;
        return await theSeat.save();
    }

    public async delete({ params, response }: HttpContextContract) {
        const theSeat: Seat = await Seat.findOrFail(params.id);
        response.status(204);
        return await theSeat.delete();
    }
}
