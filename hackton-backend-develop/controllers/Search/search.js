 const event = require('../../models/eventsModel');
 const notifications = require('../../models/notificationModel');
 const entries = require('../../models/projectsModel');
 const userModel = require('../../models/userModel');
module.exports = {
    search,
  };
  async function search(req, res) {
    const { userId } = req.decodedToken;
    console.log(userId);
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    const user = await userModel.getUserId(userId); // Assuming getUserId returns user object
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const role = user.role;
  
    try {
      // Construct regex pattern for case-insensitive search
      const pattern = `%${query}%`; // Construct pattern with wildcards
      console.log('Pattern',pattern);
  
      // Perform searches across different models
      const eventResults = await event.findByTitle(pattern);
  
      const notificationResults = await notifications.findByMessage(pattern);
      let entriesResults = [];

      if (role === 'Organizer') {
        entriesResults = await entries.findProjectTitle(pattern);
      }
      res.status(200).json({
        events: eventResults,
        notifications: notificationResults,
        entry: entriesResults,
      });
    } catch (error) {
      console.error('Error performing search:', error);
      res.status(500).json({ error: 'Failed to perform search' });
    }
  }
  
