
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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAuthenticatedUser = () => {
  const userStr = localStorage.getItem('noor_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const api = {
  async handleRequest(method: string, endpoint: string, data?: any) {
    await sleep(300); 

    const req = {
      body: data,
      params: {} as any,
      query: {} as any,
      user: getAuthenticatedUser(),
      file: data?.logo ? { path: data.logo } : null, 
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

    const pathParts = baseEndpoint.split('/');

    try {
      // NEW: REWARDS ENDPOINTS
      if (baseEndpoint === '/rewards/admin/list' && method === 'GET') await rewardController.getRewards(req, res);
      else if (baseEndpoint === '/rewards/admin/stats' && method === 'GET') await rewardController.getStats(req, res);
      else if (baseEndpoint === '/rewards/admin/save' && method === 'POST') await rewardController.saveReward(req, res);
      else if (baseEndpoint.startsWith('/rewards/admin/') && method === 'DELETE') {
         req.params.id = pathParts[pathParts.length - 1];
         await rewardController.deleteReward(req, res);
      }
      else if (baseEndpoint === '/rewards/my-achievements' && method === 'GET') await rewardController.getUserAchievements(req, res);
      else if (baseEndpoint === '/rewards/claim' && method === 'POST') await rewardController.claimReward(req, res);

      // SITE CONTENT CMS HANDLER
      else if (baseEndpoint.startsWith('/system/site-content/') && method === 'GET') {
        req.params.slug = pathParts[pathParts.length - 1];
        await contentController.getContentBySlug(req, res);
      }
      else if (baseEndpoint === '/system/site-content' && method === 'POST') await contentController.updateContent(req, res);

      // PAGE CONTENT DYNAMIC HUB
      else if (baseEndpoint.startsWith('/system/page-content/') && method === 'GET') await pageContentController.getPageContent(req, res);
      else if (baseEndpoint === '/system/page-content' && method === 'POST') await pageContentController.updatePageContent(req, res);

      // ADMIN FINANCE HUB
      else if (baseEndpoint === '/admin/finance/requests/manage' && method === 'POST') await adminPluginController.processRequestAction(req, res);
      
      // INTEGRATION HUB
      else if (baseEndpoint === '/system/public/integrations' && method === 'GET') await integrationController.getPublicIntegrations(req, res);
      else if (baseEndpoint === '/system/integrations' && method === 'GET') await integrationController.getAllIntegrations(req, res);
      else if (baseEndpoint === '/system/integrations' && method === 'POST') await integrationController.saveIntegration(req, res);
      
      // SYSTEM & BRANDING
      else if (baseEndpoint === '/system/company-profile' && method === 'PUT') await settingsController.updateCompanyProfile(req, res);
      else if (baseEndpoint === '/system/settings' && method === 'GET') await systemPluginController.getSettings(req, res);
      
      // ADMIN SPECIFIC
      else if (baseEndpoint === '/admin/pending-stats' && method === 'GET') await adminPluginController.getPendingStats(req, res);
      else if (baseEndpoint === '/admin/reports' && method === 'GET') await analyticsController.getSystemReports(req, res);
      
      // AUTH & SYSTEM
      else if (baseEndpoint === '/auth/login' && method === 'POST') await authPluginController.login(req, res);
      else if (baseEndpoint === '/auth/register' && method === 'POST') await authPluginController.register(req, res);
      else if (baseEndpoint === '/auth/team' && method === 'GET') await authPluginController.getTeam(req, res);
      
      // USER FINANCE
      else if (baseEndpoint === '/finance/history' && method === 'GET') await financePluginController.getHistory(req, res);
      else if (baseEndpoint === '/finance/withdraw' && method === 'POST') await financePluginController.withdrawReq(req, res);
      else if (baseEndpoint === '/finance/deposit' && method === 'POST') await financePluginController.depositReq(req, res);
      else if (baseEndpoint === '/finance/activate-plan' && method === 'POST') await financePluginController.activatePlan(req, res);

      // ADMIN FINANCE
      else if (baseEndpoint === '/admin/finance/deposits' && method === 'GET') await financeController.getAllDeposits(req, res);
      else if (baseEndpoint === '/admin/finance/withdrawals' && method === 'GET') await financeController.getAllWithdrawals(req, res);
      
      // WORK
      else if (baseEndpoint === '/work/tasks' && method === 'GET') await workPluginController.getTasks(req, res);
      else if (baseEndpoint === '/work/complete' && method === 'POST') await workPluginController.completeTask(req, res);

      if (statusCode >= 400) throw new Error(responseData?.message || 'System Content Error');
      return responseData;
    } catch (err: any) {
      console.error(`[API ERROR] ${endpoint}`, err);
      throw err;
    }
  },

  get(e: string) { return this.handleRequest('GET', e); },
  post(e: string, d: any) { return this.handleRequest('POST', e, d); },
  put(e: string, d: any) { return this.handleRequest('PUT', e, d); },
  patch(e: string, d?: any) { return this.handleRequest('PATCH', e, d); },
  upload(e: string, fd: FormData, method: string = 'POST') {
    const data: any = {};
    fd.forEach((v, k) => { data[k] = v; });
    return this.handleRequest(method, e, data);
  }
};
