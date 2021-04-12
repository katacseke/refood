import { userService } from '../services';

export const isSelfSSR = () => (user, ctx) => user.data._id === ctx.params.id;

const withAuthSSR = (getServerSideProps, ...conditions) => async (ctx) => {
  const token = ctx.req.cookies.access_token;
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const result = await userService.verifyToken(token);
  if (!result.success) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // checks wether the user matches at least one of the conditions
  if (conditions.length === 0 || conditions.some((condition) => condition(result, ctx))) {
    ctx.user = result.data;
    delete ctx.user.exp;
    delete ctx.user.iat;

    return getServerSideProps(ctx);
  }

  return {
    notFound: true,
  };
};

export default withAuthSSR;
