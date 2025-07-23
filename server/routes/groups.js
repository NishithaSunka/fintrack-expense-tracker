  const express = require('express');
    const { createGroup, getMyGroups, getGroupSummary, addExpenseToGroup } = require('../controllers/groupController');
    const { protect } = require('../middleware/auth');
    const router = express.Router();
    
    router.use(protect);
    
    router.post('/create', createGroup);
    router.get('/my-groups', getMyGroups);
    router.get('/:groupId/summary', getGroupSummary);
    router.post('/add-expense', addExpenseToGroup);
    
    module.exports = router;