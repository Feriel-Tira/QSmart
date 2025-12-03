const Queue = require('../models/Queue');

exports.getAllQueues = async (req, res) => {
  try {
    const queues = await Queue.find({ isActive: true });
    res.json(queues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQueueById = async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }
    res.json(queue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQueue = async (req, res) => {
  try {
    const { name, description, maxActiveTickets, averageServiceTime } = req.body;
    
    const queue = new Queue({
      name,
      description,
      maxActiveTickets: maxActiveTickets || 5,
      averageServiceTime: averageServiceTime || 300,
    });
    
    await queue.save();
    res.status(201).json(queue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateQueue = async (req, res) => {
  try {
    const queue = await Queue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }
    
    res.json(queue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteQueue = async (req, res) => {
  try {
    const queue = await Queue.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }
    
    res.json({ message: 'Queue deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};