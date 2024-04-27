/* eslint-disable no-use-before-define */
const { Router } = require('express');
const authenticate = require('../api/auth/authenticate');
const botController=require('./../controllers/chatBotController/botController')
const router = Router();

router.post('/', botController.chatBot);


module.exports = router;
