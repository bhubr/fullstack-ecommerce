import { expressjwt } from 'express-jwt';
import { jwtSecret } from '../settings';
import isEmpty from '../helpers/is-empty';

const checkJwt = expressjwt({
  algorithms: ['HS256'],
  secret: jwtSecret,
  getToken: (req) => {
    if (req.cookies.jwt !== undefined) {
      return req.cookies.jwt;
    }
    if (!isEmpty(req.headers.authorization)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const parts = req.headers.authorization!.split(' ');
      return parts[0] === 'Bearer' ? parts[1] : null;
    }
  },
});

export default checkJwt;
