
import { authPluginController } from '../backend_core/plugins/auth/controller';
import { financePluginController } from '../backend_core/plugins/finance/controller';
import { workPluginController } from '../backend_core/plugins/work/controller';
import { systemPluginController } from '../backend_core/plugins/system/controller';
import { seoController } from '../backend_core/plugins/system/seoController';
import { gamificationController } from '../backend_core/controllers/gamificationController';
import { financeController } from '../backend_core/controllers/financeController';
import { workController } from '../backend_core/controllers/workController';
import { analyticsController } from '../backend_core/controllers/analyticsController';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAuthenticatedUser = () => {
  const userStr = localStorage.getItem('noor_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const api = {
  async handleRequest(method: string, endpoint: string, data?: any) {
    await sleep(400); // UI responsiveness simulate

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

    try {
      // AUTH & SYSTEM
      if (endpoint === '/auth/login' && method === 'POST') await authPluginController.login(req, res);
      else if (endpoint === '/auth/register' && method === 'POST') await authPluginController.register(req, res);
      else if (endpoint === '/auth/team' && method === 'GET') await authPluginController.getTeam(req, res);
      
      // USER FINANCE
      else if (endpoint === '/finance/history' && method === 'GET') await financePluginController.getHistory(req, res);
      else if (endpoint === '/finance/withdraw' && method === 'POST') await financePluginController.withdrawReq(req, res);
      else if (endpoint === '/finance/deposit' && method === 'POST') await financePluginController.depositReq(req, res);

      // ADMIN FINANCE
      else if (endpoint === '/admin/finance/deposits' && method === 'GET') await financeController.getAllDeposits(req, res);
      else if (endpoint === '/admin/finance/withdrawals' && method === 'GET') await financeController.getAllWithdrawals(req, res);
      else if (endpoint === '/admin/reports' && method === 'GET') await analyticsController.getSystemReports(req, res);
      
      // ADMIN ACTIONS
      else if (endpoint === '/admin/finance/deposit/approve' && method === 'POST') await financeController.approveDeposit(req, res);
      else if (endpoint === '/admin/finance/deposit/reject' && method === 'POST') await financeController.rejectDeposit(req, res);
      else if (endpoint === '/admin/finance/withdraw/approve' && method === 'POST') await financeController.approveWithdrawal(req, res);
      else if (endpoint === '/admin/finance/withdraw/reject' && method === 'POST') await financeController.rejectWithdrawal(req, res);

      // WORK
      else if (endpoint === '/work/tasks' && method === 'GET') await workPluginController.getTasks(req, res);
      else if (endpoint === '/work/complete' && method === 'POST') await workPluginController.completeTask(req, res);
      else if (endpoint === '/admin/work/submissions' && method === 'GET') await workController.getAllSubmissions(req, res);

      if (statusCode >= 400) throw new Error(responseData?.message || 'Node Failure');
      return responseData;
    } catch (err: any) {
      console.error(`[API ERROR] ${endpoint}`, err);
      throw err;
    }
  },

  get: (e: string) => api.handleRequest('GET', e),
  post: (e: string, d: any) => api.handleRequest('POST', e, d),
  put: (e: string, d: any) => api.handleRequest('PUT', e, d),
  upload: (e: string, fd: FormData, method: string = 'POST') => {
    const data: any = {};
    fd.forEach((v, k) => { data[k] = v; });
    return api.handleRequest(method, e, data);
  }
};
