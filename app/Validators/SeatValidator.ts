import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SeatValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    theater_id: schema.number([rules.exists({ table: 'theaters', column: 'id' })]),
    reclining: schema.boolean(),
    location: schema.string([rules.minLength(2), rules.unique({ 
      table: 'seats', 
      column: 'location', 
      caseInsensitive: true,
      where:{ theater_id: this.ctx.request.body()['theater_id']}
    })]),
  })

  public messages: CustomMessages = {}
}
