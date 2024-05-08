import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Theater from './Theater'
import Movie from './Movie'

export default class Screening extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public date: DateTime

  @column()
  public theater_id: number

  @column()
  public movie_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Theater, {
    foreignKey: 'theater_id'
  })
  public theater: BelongsTo<typeof Theater>

  @belongsTo(() => Movie, {
    foreignKey: 'movie_id'
  })
  public movie: BelongsTo<typeof Movie>
}
