import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Theater from 'App/Models/Theater';
import TheaterValidator from 'App/Validators/TheaterValidator';

export default class TheatersController {

    public async find({request,params}:HttpContextContract){
        if(params.id){
            // return Theater.findOrFail(params.id);
            let theTheater=await Theater.findOrFail(params.id)
            await theTheater.load("projector")
            await theTheater.load("seats")
            await theTheater.load("screenings", actualScreening=>{
                actualScreening.preload("movie")
            })
            return theTheater;
        }else{
            const data = request.all()
            if("page" in data && "per_page" in data){
                const page = request.input('page', 1);
                const perPage = request.input("per_page",20);
                return await Theater.query().preload("projector").paginate(page, perPage)
            }else{
                return await Theater.query().preload("projector")
            }            
        }
    }

    public async create({request}:HttpContextContract){
        // const body = request.body();
        const body = await request.validate(TheaterValidator);
        const theTheater:Theater = await Theater.create(body);
        return theTheater;
    }

    public async update({params,request}:HttpContextContract) {
        const theTheater:Theater = await Theater.findOrFail(params.id);
        const body = request.body();
        theTheater.location = body.location;
        theTheater.capacity = body.capacity;
        return theTheater.save();
    }

    public async delete({params,response}:HttpContextContract) {
        const theTheater:Theater = await Theater.findOrFail(params.id);
        await theTheater.load("projector")
        await theTheater.load("seats")
        await theTheater.load("screenings")
        if (theTheater.projector) {
            response.status(400);
            return { "message": "No se puede eliminar porque tiene un proyector asociado"}
        } else if (theTheater.seats) {
            response.status(400);
            return { "message": "No se puede eliminar porque tiene sillas asociadas"}
        } else if (theTheater.screenings) {
            response.status(400);
            return { "message": "No se puede eliminar porque tiene funciones asociadas"}
        } else {
            response.status(204);
            return theTheater.delete();
        }
    }
}
