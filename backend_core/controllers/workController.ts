
/**
 * Noor Official V3 - Work Controller
 * Manages assignments and user submissions.
 */
const getTasksDB = () => {
  const data = localStorage.getItem('noor_tasks_db');
  if (!data) {
    const initialTasks = [
      { id: 'NODE-101', title: 'Official Channel Subscription', reward: 25, plan: 'BASIC', mediaType: 'link', mediaUrl: 'https://youtube.com', instruction: '1. Open link. 2. Subscribe and take screenshot. 3. Upload proof.', targetUsers: [], isActive: true },
      { id: 'NODE-102', title: 'Premium Portal Audit', reward: 150, plan: 'GOLD PRIME', mediaType: 'link', mediaUrl: 'https://google.com', instruction: 'Verify premium ad nodes and capture screenshots.', targetUsers: [], isActive: true }
    ];
    localStorage.setItem('noor_tasks_db', JSON.stringify(initialTasks));
    return initialTasks;
  }
  return JSON.parse(data);
};

const saveTasksDB = (db: any[]) => {
  localStorage.setItem('noor_tasks_db', JSON.stringify(db));
};

export const workController = {
  createTask: async (req: any, res: any) => {
    const taskData = req.body;
    const db = getTasksDB();
    const newTask = { 
      ...taskData, 
      id: `NODE-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      createdAt: new Date().toISOString()
    };
    db.unshift(newTask);
    saveTasksDB(db);
    return res.status(201).json({ message: 'Node Published Successfully!', task: newTask });
  },

  getAvailableTasks: async (req: any, res: any) => {
    const { userId } = req.query;
    const db = getTasksDB();
    // In a real scenario, filter tasks based on user's active plan
    const filtered = db.filter((t: any) => 
      t.isActive && (t.targetUsers.length === 0 || t.targetUsers.includes(userId))
    );
    return res.status(200).json(filtered);
  },

  getAllSubmissions: async (req: any, res: any) => {
    const db = JSON.parse(localStorage.getItem('noor_mock_db') || '[]');
    let submissions: any[] = [];
    db.forEach((u: any) => {
      if (u.workSubmissions) {
        submissions = [...submissions, ...u.workSubmissions.map((s: any) => ({ ...s, userName: u.name, userId: u.id }))];
      }
    });
    return res.status(200).json(submissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  },

  reviewSubmission: async (req: any, res: any) => {
    const { userId, submissionId, status, reward } = req.body;
    let db = JSON.parse(localStorage.getItem('noor_mock_db') || '[]');
    const uIdx = db.findIndex((u: any) => u.id === userId);
    if (uIdx === -1) return res.status(404).json({ message: "Partner not found" });

    const subIdx = db[uIdx].workSubmissions.findIndex((s: any) => s.id === submissionId);
    if (subIdx === -1) return res.status(404).json({ message: "Submission not found" });

    if (db[uIdx].workSubmissions[subIdx].status !== 'pending') {
      return res.status(400).json({ message: "Already processed." });
    }

    db[uIdx].workSubmissions[subIdx].status = status;
    if (status === 'approved') {
      db[uIdx].balance = (Number(db[uIdx].balance) || 0) + Number(reward);
      if (!db[uIdx].transactions) db[uIdx].transactions = [];
      db[uIdx].transactions.unshift({
        id: `REW-${submissionId}`,
        type: 'reward',
        amount: Number(reward),
        status: 'approved',
        gateway: 'Task Yield',
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      });
    }

    localStorage.setItem('noor_mock_db', JSON.stringify(db));
    return res.status(200).json({ message: `Audit finalized: ${status}` });
  }
};
