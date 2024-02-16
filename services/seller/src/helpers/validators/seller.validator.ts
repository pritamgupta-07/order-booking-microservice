import Joi from "joi";

export const schema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .lowercase()
    .description("name of your shop.")
    .required(),
  category: Joi.string()
    .lowercase()
    .valid("restaurant", "bakery", "sweet shop", "stall")
    .required(),
  description: Joi.string()
    .lowercase()
    .min(3)
    .max(100)
    .description("something interesting about your shop.")
    .required(),
  location: {
    state: Joi.string().lowercase().required(),
    city: Joi.string().lowercase().required(),
    place: Joi.string().lowercase().required(),
    landmark: Joi.string().lowercase().optional(),
  },
  isPureVeg: Joi.boolean().default(false).required(),
  foodType: Joi.string()
    .lowercase()
    .required()
    .description("example: italian, chinese etc."),
  isSponsored: Joi.boolean().default(false).optional(),
  logoUrl: Joi.string().required(),
  websiteUrl: Joi.string().optional(),
  openingHour: Joi.string().lowercase().required(),
  contact: {
    mobile: Joi.number().required(),
    email: Joi.string().email().optional(),
  },
  facilities: Joi.array().items(Joi.string().lowercase().optional()),
  restaurantPhotos: Joi.array().items(Joi.string().lowercase().optional()),
  menuPhotos: Joi.array().items(Joi.string().lowercase().optional()),
});

export const sellerValidation = async (data: Joi.Schema) => {
  const value = await schema.validateAsync(data);

  return value;
};
