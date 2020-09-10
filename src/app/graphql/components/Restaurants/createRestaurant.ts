import { Restaurant } from "#root/infra/database/models";

const createRestaurantResolver = (
  context: any,
  { chefId, name }: { chefId: string; name: string }
) => {
  return Restaurant.create({ chefId, name });
};

export default createRestaurantResolver;
