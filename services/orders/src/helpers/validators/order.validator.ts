import Joi from "joi";

const schema = Joi.object({
  customerId: Joi.string().required(),
  vendorStoreId: Joi.string().required(),
  customerName: Joi.string().required(),
  customerMobileNumber: Joi.string().length(10).required(),
  orderItems: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().required(),
    })
  ),
  paymentMode: Joi.string().valid("cash", "online").required(),
});

const updateOrderStatusSchema = Joi.object({
  orderStatus: Joi.string().valid("confirmed", "cancelled").required(),
  orderId: Joi.string().required(),
});

const completeOrderSchema = Joi.object({
  orderNumber: Joi.number().max(10000).required(),
  orderOTP: Joi.string().length(4).required(),
  vendorStoreId: Joi.string().required(),
});

const forgetOrderOTP = Joi.object({
  customerMobileNumber: Joi.string()
    .length(4)
    .description("please provide last 4 digit of phone number")
    .required(),
  vendorStoreId: Joi.string().required(),
});

export const orderValidation = async (
  data: Joi.Schema,
  validationFor: ValidationFor
) => {
  switch (validationFor) {
    case "createOrder":
      return await schema.validateAsync(data);
    case "updateOrderStatus":
      return await updateOrderStatusSchema.validateAsync(data);
    case "completeOrder":
      return await completeOrderSchema.validateAsync(data);
    case "forgetOrderOTP":
      return await forgetOrderOTP.validateAsync(data);
  }
};

type ValidationFor =
  | "createOrder"
  | "updateOrderStatus"
  | "completeOrder"
  | "forgetOrderOTP";
