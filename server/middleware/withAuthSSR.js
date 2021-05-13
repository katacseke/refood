import userService from '@services/userService';

export const isSelfSSR = () => (user, ctx) => user.id === ctx.params.id;

export const hasRoleSSR = (role) => (user) => user.role === role;

/**
 * Higher order function for handling authentication with server side rendering.
 * it authorizes the user based on conditions.
 * - If the user is not authenticated, or the token is not valid,
 *   it redirects to the login page.
 * - If none of the conditions is met, it responds with 404.
 * - If no conditions are supplied, or at least one of the conditions is met,
 *   and the token is valid, it authorizes the request,
 *   and runs the getServerSideProps function.
 *
 * @param {function} getServerSideProps
 * @param  {...function} conditions
 */
const withAuthSSR = (getServerSideProps, ...conditions) => async (ctx) => {
  const token = ctx.req.cookies.access_token;
  if (!token) {
    return {
      redirect: {
        destination: `/login?next=${encodeURIComponent(ctx.resolvedUrl)}`,
        permanent: false,
      },
    };
  }
  try {
    const result = await userService.verifyToken(token);

    // checks wether the user matches at least one of the conditions
    if (conditions.length === 0 || conditions.some((condition) => condition(result, ctx))) {
      ctx.user = result;
      delete ctx.user.exp;
      delete ctx.user.iat;

      return getServerSideProps(ctx);
    }

    return {
      notFound: true,
    };
  } catch {
    return {
      redirect: {
        destination: `/login?next=${encodeURIComponent(ctx.resolvedUrl)}`,
        permanent: false,
      },
    };
  }
};

export default withAuthSSR;
