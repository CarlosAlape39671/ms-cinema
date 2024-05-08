import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Movie from 'App/Models/Movie';

export default class MoviesController {

    public async find({ request, params }: HttpContextContract) {
        if (params.id) {
            let theMovie: Movie = await Movie.findOrFail(params.id);
            await theMovie.load("screenings", screeningQuery=>{
                screeningQuery.preload("theater", theaterQuery=>{
                    theaterQuery.preload("projector")
                    .preload("seats")
                })
            })
            return theMovie;
        } else {
            const data = request.all()
            if ("page" in data && "per_page" in data) {
                const page = request.input('page', 1);
                const perPage = request.input("per_page", 20);
                return await Movie.query().paginate(page, perPage)
            } else {
                return await Movie.query()
            }

        }

    }

    public async create({ request }: HttpContextContract) {
        const body = request.body();
        const theMovie: Movie = await Movie.create(body);
        return theMovie;
    }

    public async update({ params, request }: HttpContextContract) {
        const theMovie: Movie = await Movie.findOrFail(params.id);
        const body = request.body();
        theMovie.name = body.name;
        theMovie.year = body.year;
        theMovie.duration = body.duration;
        return await theMovie.save();
    }

    public async delete({ params, response }: HttpContextContract) {
        const theMovie: Movie = await Movie.findOrFail(params.id);
        // response.status(204);
        // return await theMovie.delete();
        await theMovie.load("screenings")
        if (theMovie.screenings) {
            response.status(400);
            return { "message": "No se puede eliminar porque tiene funciones asociadas"}
        } else {
            response.status(204);
            return await theMovie.delete();
        }
    }

}
