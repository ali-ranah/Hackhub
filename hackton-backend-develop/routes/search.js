const { Router } = require('express');
const  search  = require('../controllers/Search/search');
const authenticate = require('../api/auth/authenticate');
const router = Router();


// Define route for search
router.get('/',authenticate, search.search);

module.exports = router;
