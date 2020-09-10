import { Chef } from "#root/infra/database/models";

const createChefResolver = (context: any, { name }: { name: string }) => {
  return Chef.create({ name });
};

export default createChefResolver;