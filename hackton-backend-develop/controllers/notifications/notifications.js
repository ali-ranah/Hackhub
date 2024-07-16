const Notification = require('../../models/notificationModel');

module.exports = {
  getNotifications,
  createNotification,
  getNotificationById,
  deleteNotification,
};

async function getNotifications(req, res) {
  const { userId } = req.decodedToken;

  try {
    const notifications = await Notification.getByUserId(userId);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
}



async function createNotification(req, res) {
  const newNotification = req.body;

  try {
    const createdNotification = await Notification.add(newNotification);
    res.status(201).json(createdNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
}

async function getNotificationById(req, res) {
  const notificationId = req.params.id;

  try {
    const notification = await Notification.findById(notificationId);
    if (notification) {
      res.status(200).json(notification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    console.error('Error getting notification by ID:', error);
    res.status(500).json({ error: 'Failed to fetch notification' });
  }
}



async function deleteNotification(req, res) {
  const {id} = req.params;
  console.log(`Deleting notification ${id}`);

  try {
    const deletedNotification = await Notification.remove(id);
    if (deletedNotification) {
      res.status(200).json(deletedNotification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
}
