const router = require('express').Router();
const { getMe, updateUser } = require('../controllers/users');
const { updateProfileValidator } = require('../middlewares/validation');

router.get('/me', getMe);
router.patch('/me', updateProfileValidator, updateUser);

module.exports = router;
