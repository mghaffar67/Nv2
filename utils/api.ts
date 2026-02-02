
import { authPluginController } from '../backend_core/plugins/auth/controller';
import { financePluginController } from '../backend_core/plugins/finance/controller';
import { workPluginController } from '../backend_core/plugins/work/controller';
import { financeController } from '../backend_core/controllers/financeController';
import { analyticsController } from '../backend_core/controllers/analyticsController';
import { adminPluginController } from '../backend_core/plugins/admin/controller';
import { rewardController } from '../backend_core/plugins/reward/controller';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAuthenticatedUser = () => {
  const userStr = localStorage.getItem('noor_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const api = {
  async handleRequest(method: string, endpoint: string, data?: any) {
    await sleep(200); 

    const req = {
      body: data,
      params: {} as any,
      query: {} as any,
      user: getAuthenticatedUser(),
      headers: { authorization: `Bearer ${localStorage.getItem('noor_token')}` }
    };

    let responseData: any = null;
    let statusCode = 200;

    const res = {
      status: (code: number) => {
        statusCode = code;
        return { json: (data: any) => { responseData = data; } };
      }
    };

    // Extract params and query
    const parts = endpoint.split('?');
    const baseEndpoint = parts[0];
    if (parts[1]) {
      const qParams = new URLSearchParams(parts[1]);
      qParams.forEach((v, k) => { req.query[k] = v; });
    }

    const pathParts = baseEndpoint.split('/');

    try {
      // --- ADMIN ROUTES ---
      if (baseEndpoint === '/admin/users' && method === 'GET') await adminPluginController.getAllUsers(req, res);
      else if (baseEndpoint === '/admin/reports' && method === 'GET') await analyticsController.getSystemReports(req, res);
      else if (baseEndpoint === '/admin/tasks' && method === 'GET') await workPluginController.adminList(req, res);
      else if (baseEndpoint === '/rewards/admin/list' && method === 'GET') await rewardController.getRewards(req, res);
      else if (baseEndpoint === '/rewards/admin/stats' && method === 'GET') await rewardController.getStats(req, res);
      
      // --- USER ROUTES ---
      else if (baseEndpoint === '/auth/login' && method === 'POST') await authPluginController.login(req, res);
      else if (baseEndpoint === '/auth/register' && method === 'POST') await authPluginController.register(req, res);
      else if (baseEndpoint === '/auth/team' && method === 'GET') await authPluginController.getTeam(req, res);
      else if (baseEndpoint === '/work/tasks' && method === 'GET') await workPluginController.getTasks(req, res);
      else if (baseEndpoint === '/work/complete' && method === 'POST') await workPluginController.completeTask(req, res);
      else if (baseEndpoint === '/finance/history' && method === 'GET') await financePluginController.getHistory(req, res);
      else if (baseEndpoint === '/admin/finance/deposits' && method === 'GET') await financeController.getAllDeposits(req, res);
      else if (baseEndpoint === '/admin/finance/withdrawals' && method === 'GET') await financeController.getAllWithdrawals(req, res);
      else if (baseEndpoint === '/admin/finance/requests/manage' && method === 'POST') await adminPluginController.processRequestAction(req, res);
      else if (baseEndpoint === '/rewards/my-achievements' && method === 'GET') await rewardController.getUserAchievements(req, res);

      if (statusCode >= 400) throw new Error(responseData?.message || 'Node Error');
      return responseData;
    } catch (err: any) {
      console.error(`[API FAIL] ${endpoint}`, err);
      throw err;
    }
  },

  get(e: string) { return this.handleRequest('GET', e); },
  post(e: string, d: any) { return this.handleRequest('POST', e, d); },
  put(e: string, d: any) { return this.handleRequest('PUT', e, d); },
  delete(e: string) { return this.handleRequest('DELETE', e); },
  upload(e: string, fd: FormData, method: string = 'POST') {
    const data: any = {};
    fd.forEach((v, k) => { data[k] = v; });
    return this.handleRequest(method, e, data);
  }
};
