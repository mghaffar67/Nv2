
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

    const parts = endpoint.split('/');
    if (parts.length > 3) {
      req.params.pageKey = parts[parts.length - 1];
      req.params.id = parts[parts.length - 2];
    }

    try {
      // PAGE CONTENT DYNAMIC HUB
      if (endpoint.startsWith('/system/page-content/') && method === 'GET') await pageContentController.getPageContent(req, res);
      else if (endpoint === '/system/page-content' && method === 'POST') await pageContentController.updatePageContent(req, res);

      // ADMIN CONSOLIDATED FINANCE HUB
      else if (endpoint === '/admin/finance/requests/manage' && method === 'POST') await adminPluginController.processRequestAction(req, res);
      
      // INTEGRATION HUB
      else if (endpoint === '/system/public/integrations' && method === 'GET') await integrationController.getPublicIntegrations(req, res);
      else if (endpoint === '/system/integrations' && method === 'GET') await integrationController.getAllIntegrations(req, res);
      else if (endpoint === '/system/integrations' && method === 'POST') await integrationController.saveIntegration(req, res);
      else if (endpoint.includes('/toggle') && method === 'PATCH') {
        req.params.id = parts[parts.length - 2];
        await integrationController.toggleStatus(req, res);
      }
      else if (endpoint.startsWith('/system/integrations/') && method === 'DELETE') {
        req.params.id = parts[parts.length - 1];
        await integrationController.deleteIntegration(req, res);
      }

      // SYSTEM & BRANDING
      else if (endpoint === '/system/company-profile' && method === 'PUT') await settingsController.updateCompanyProfile(req, res);
      else if (endpoint === '/system/settings' && method === 'GET') await systemPluginController.getSettings(req, res);
      
      // ADMIN SPECIFIC
      else if (endpoint === '/admin/pending-stats' && method === 'GET') await adminPluginController.getPendingStats(req, res);
      
      // AUTH & SYSTEM
      else if (endpoint === '/auth/login' && method === 'POST') await authPluginController.login(req, res);
      else if (endpoint === '/auth/register' && method === 'POST') await authPluginController.register(req, res);
      else if (endpoint === '/auth/team' && method === 'GET') await authPluginController.getTeam(req, res);
      
      // USER FINANCE
      else if (endpoint === '/finance/history' && method === 'GET') await financePluginController.getHistory(req, res);
      else if (endpoint === '/finance/withdraw' && method === 'POST') await financePluginController.withdrawReq(req, res);
      else if (endpoint === '/finance/deposit' && method === 'POST') await financePluginController.depositReq(req, res);
      else if (endpoint === '/finance/activate-plan' && method === 'POST') await financePluginController.activatePlan(req, res);

      // ADMIN FINANCE
      else if (endpoint === '/admin/finance/deposits' && method === 'GET') await financeController.getAllDeposits(req, res);
      else if (endpoint === '/admin/finance/withdrawals' && method === 'GET') await financeController.getAllWithdrawals(req, res);
      else if (endpoint === '/admin/reports' && method === 'GET') await analyticsController.getSystemReports(req, res);
      
      // WORK
      else if (endpoint === '/work/tasks' && method === 'GET') await workPluginController.getTasks(req, res);
      else if (endpoint === '/work/complete' && method === 'POST') await workPluginController.completeTask(req, res);

      if (statusCode >= 400) throw new Error(responseData?.message || 'Identity Node Error');
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
