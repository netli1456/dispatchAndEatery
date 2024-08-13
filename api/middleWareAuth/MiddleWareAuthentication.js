


export const sanitizeUser = (user) => {
  const { password, ...userData } = user.toObject();
  return userData;
};

export const sanitizeKitchen = (kitchen) => {
  const { password, ...kitchenData } = kitchen.toObject();
  return kitchenData;
};





