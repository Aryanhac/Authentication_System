import Express from 'express'
import { register,logIn, logOut } from '../Controllers/user';
import passport from 'passport';
import initializingPassport from '../../passportConfig';
import session from 'express-session';

const secretKey = process.env.JWT_SECRET_ID || 'default-secret-key';

initializingPassport(passport);
const app=Express.Router();

app.use(
    session({
      secret: secretKey,
      resave: false,
      saveUninitialized: false,
    })
  );



app.use(passport.initialize());
app.use(passport.session());


app.post('/register',register);

app.post('/logIn',passport.authenticate('local', {
    failureRedirect: '/api/login',
}),logIn);

app.get('/logOut',logOut);

export default app