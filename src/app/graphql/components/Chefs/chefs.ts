import { Chef } from "#root/infra/database/models";

const chefsResolver = () => {
  return Chef.findAll();
};

export default chefsResolver;
