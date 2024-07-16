const { Router } = require('express');
const passport = require('passport');
const authRoutes = require('./auth');
const eventRoutes = require('./events');
const categoriesRoutes = require('./categories.js');
const usersRoutes = require('./users');
const { googleAuthStrategy } = require('../api/auth/googleStrategy');
const { githubAuthStrategy } = require('../api/auth/githubStrategy');
const { chatBot } = require('../controllers/chatBotController/botController.js');
const { Compiler } = require('../controllers/compilerController/compilerController.js');
const notificationsRoutes = require('../routes/notifications.js')
const searchRoutes = require('../routes/search.js');


const router = Router();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

googleAuthStrategy();
githubAuthStrategy();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/event-category', categoriesRoutes);
router.use('/users', usersRoutes);
router.use('/ask', chatBot);
router.use('/compile',Compiler );
router.use('/notifications',notificationsRoutes );
router.use('/search',searchRoutes );


module.exports = router;
