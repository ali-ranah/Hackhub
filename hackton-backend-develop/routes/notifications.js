/* eslint-disable no-use-before-define */
const { Router } = require('express');
const notificationController=require('./../controllers/notifications/notifications')
const router = Router();
const authenticate = require('../api/auth/authenticate');


router.get('/get',authenticate, notificationController.getNotifications);

router.delete('/delete/:id',authenticate, notificationController.deleteNotification);

module.exports = router;
