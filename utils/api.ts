
import { authPluginController } from '../backend_core/plugins/auth/controller';
import { financePluginController } from '../backend_core/plugins/finance/controller';
import { workPluginController } from '../backend_core/plugins/work/controller';
import { financeController } from '../backend_core/controllers/financeController';
import { analyticsController } from '../backend_core/controllers/analyticsController';
import { adminPluginController } from '../backend_core/plugins/admin/controller';
import { systemPluginController } from '../backend_core/plugins/system/controller';
import { settingsController } from '../backend_core/plugins/system/settingsController';
import { integrationController } from '../backend_core/plugins/system/integrationController';
import { pageContentController } from '../backend_core/plugins/system/pageContentController';
import { contentController } from '../backend_core/plugins/system/contentController';
import { rewardController } from '../backend_core/plugins/reward/controller';
import { missionController } from '../backend_core/plugins/mission/controller';
import { supportController } from '../backend_core/controllers/supportController';

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

    const parts = endpoint.split('?');
    const baseEndpoint = parts[0];
    if (parts[1]) {
      const qParams = new URLSearchParams(parts[1]);
      qParams.forEach((v, k) => { req.query[k] = v; });
    }

    try {
      // Support Nodes
      if (baseEndpoint === '/system/support/ai-query' && method === 'POST') await supportController.aiQuery(req, res);
      else if (baseEndpoint === '/system/support/chats' && method === 'GET') await supportController.getChats(req, res);
      else if (baseEndpoint === '/system/support/send' && method === 'POST') await supportController.sendMessage(req, res);
      else if (baseEndpoint === '/system/support/resolve' && method === 'POST') await supportController.resolveChat(req, res);
      
      // Existing Nodes...
      else if (baseEndpoint === '/rewards/admin/list' && method === 'GET') await rewardController.getRewards(req, res);
      else if (baseEndpoint === '/rewards/admin/stats' && method === 'GET') await rewardController.getStats(req, res);
      else if (baseEndpoint === '/rewards/admin/save' && method === 'POST') await rewardController.saveReward(req, res);
      else if (baseEndpoint === '/rewards/my-achievements' && method === 'GET') await rewardController.getUserAchievements(req, res);
      else if (baseEndpoint === '/rewards/claim' && method === 'POST') await rewardController.claimReward(req, res);
      else if (baseEndpoint === '/admin/reports' && method === 'GET') await analyticsController.getSystemReports(req, res);
      else if (baseEndpoint === '/auth/login' && method === 'POST') await authPluginController.login(req, res);
      else if (baseEndpoint === '/auth/register' && method === 'POST') await authPluginController.register(req, res);
      else if (baseEndpoint === '/auth/team' && method === 'GET') await authPluginController.getTeam(req, res);
      else if (baseEndpoint === '/finance/history' && method === 'GET') await financePluginController.getHistory(req, res);
      else if (baseEndpoint === '/admin/finance/deposits' && method === 'GET') await financeController.getAllDeposits(req, res);
      else if (baseEndpoint === '/admin/finance/withdrawals' && method === 'GET') await financeController.getAllWithdrawals(req, res);
      else if (baseEndpoint === '/work/tasks' && method === 'GET') await workPluginController.getTasks(req, res);

      if (statusCode >= 400) throw new Error(responseData?.message || 'Protocol Failure');
      return responseData;
    } catch (err: any) {
      throw err;
    }
  },

  get(e: string) { return this.handleRequest('GET', e); },
  post(e: string, d: any) { return this.handleRequest('POST', e, d); },
  put(e: string, d: any) { return this.handleRequest('PUT', e, d); },
  upload(e: string, fd: FormData, method: string = 'POST') {
    const data: any = {};
    fd.forEach((v, k) => { data[k] = v; });
    return this.handleRequest(method, e, data);
  }
};
