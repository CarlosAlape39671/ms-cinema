import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Screening from 'App/Models/Screening';

export default class ScreeningsController {

    public async find({ request, params }: HttpContextContract) {
        if (params.id) {
            let theScreening: Screening = await Screening.findOrFail(params.id);
            await theScreening.load("theater");
            return theScreening;
        } else {
            const data = request.all()
            if ("page" in data && "per_page" in data) {
                const page = request.input('page', 1);
                const perPage = request.input("per_page", 20);
                return await Screening.query().paginate(page, perPage)
            } else {
                return await Screening.query()
            }

        }

    }
    public async create({ request }: HttpContextContract) {
        const body = request.body();
        const theScreening: Screening = await Screening.create(body);
        return theScreening;
    }

    public async update({ params, request }: HttpContextContract) {
        const theScreening: Screening = await Screening.findOrFail(params.id);
        const body = request.body();
        theScreening.date = body.date;
        theScreening.movie_id = body.movie_id;
        theScreening.theater_id = body.theater_id;
        return await theScreening.save();
    }

    public async delete({ params, response }: HttpContextContract) {
        const theScreening: Screening = await Screening.findOrFail(params.id);
        response.status(204);
        return await theScreening.delete();
    }
    
}
