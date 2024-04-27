/* eslint-disable no-use-before-define */
const { Router } = require('express');
const compilerController=require('./../controllers/compilerController/compilerController')
const router = Router();

router.post('/', compilerController.Compiler);


module.exports = router;
