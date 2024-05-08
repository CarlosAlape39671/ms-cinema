import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/screenings", "ScreeningsController.find");
    Route.get("/screenings/:id", "ScreeningsController.find");
    Route.post("/screenings", "ScreeningsController.create");
    Route.put("/screenings/:id", "ScreeningsController.update");
    Route.delete("/screenings/:id", "ScreeningsController.delete");
})