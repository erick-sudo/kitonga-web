export const baseUrl = `${import.meta.env.VITE_KITONGA_API}/api/v1`;

export const APIS = {
  account: {
    getOtp: `${baseUrl}/otp/request`,
    login: `${baseUrl}/auth/access-token`,
    getCurrentUser: `${baseUrl}/current/user`,
    changePassword: `${baseUrl}/change/password`,
  },
  authorization: {
    accessPolicies: {
      index: `${baseUrl}/authorization/access_policies`,
      show: `${baseUrl}/authorization/access_policies/<:policyId>`,
      create: `${baseUrl}/authorization/access_policies`,
      destroy: `${baseUrl}/authorization/access_policies/<:policyId>`,
      count: `${baseUrl}/authorization/access_policies/stats/count`,
    },
    resourceActions: {
      index: `${baseUrl}/authorization/resource_actions`,
      show: `${baseUrl}/authorization/resource_actions/<:actionId>`,
      create: `${baseUrl}/authorization/resource_actions`,
      destroy: `${baseUrl}/authorization/resource_actions/<:actionId>`,
      count: `${baseUrl}/authorization/resource_actions/stats/count`,
      
    },
    searchResource: `${baseUrl}/authorization/policy_search/<:resource>`, 
  },
  statistics: {
    casesCount: `${baseUrl}/stats/cases/count`,
    clientsCount: `${baseUrl}/stats/clients/count`,
    searchCasesCount: `${baseUrl}/stats/search/cases/count`,
    searchClientsCount: `${baseUrl}/stats/search/clients/count`,
    showClientCaseStatusTally: `${baseUrl}/stats/clients/<:clientId>/cases/status/tally`,
  },
  pagination: {
    getCases: `${baseUrl}/pages/cases`,
    getClients: `${baseUrl}/pages/clients/`,
    filter: {
      filterCases: `${baseUrl}/filter/cases/<:q>/<:v>`,
    },
    search: {
      searchCases: `${baseUrl}/search/cases`,
      searchClients: `${baseUrl}/search/clients`,
    },
  },
  filter: {
    casesFilter: `${baseUrl}/filter/cases`,
    caseRangeFilter: `${baseUrl}/filter/range/cases`,
  },
  users: {
    getBriefUsers: `${baseUrl}/users/brief`,
  },
  clients: {
    getAllClients: `${baseUrl}/clients/all`,
    postClient: `${baseUrl}/clients/new`,
    patchClient: `${baseUrl}/clients/<:clientId>/update`,
    getClient: `${baseUrl}/clients/<:clientId>/get`,
    deleteClient: `${baseUrl}/clients/<:clientId>/delete`,
  },
  parties: {
    crud: `${baseUrl}/parties/<:id>`,
  },
  payments: {
    crud: `${baseUrl}/payments/<:id>`,
  },
  cases: {
    getCase: `${baseUrl}/cases/<:caseId>`,
    getPaymentInformation: `${baseUrl}/cases/<:caseId>/payment_information`,
    patchPaymentInformation: `${baseUrl}/cases/<:caseId>/payment_information`,
    getImportantDates: `${baseUrl}/cases/<:caseId>/important_dates`,
    getHearings: `${baseUrl}/cases/<:caseId>/hearings`,
    getTasks: `${baseUrl}/cases/<:caseId>/tasks`,
    getParties: `${baseUrl}/cases/<:caseId>/parties`,
    postCase: `${baseUrl}/cases/new`,
    patchCase: `${baseUrl}/cases/<:caseId>/update`,
    initializePaymentInformation: `${baseUrl}/cases/<:caseId>/initialize_payment_information`,
    addInstallment: `${baseUrl}/cases/<:caseId>/add_installment`,
    addParty: `${baseUrl}/cases/<:caseId>/add_party`,
    deleteCase: `${baseUrl}/cases/<:caseId>`,
    bulkDestruction: `${baseUrl}/cases/destroy/multiple`,
  },
  dash: {
    deepSearch: `${baseUrl}/dashboard/deep/search`,
    getCasesPerClient: `${baseUrl}/dashboard/cases/per/client`,
    getDashCounts: `${baseUrl}/dashboard/counts`,
    getFirst6MostRecentCases: `${baseUrl}/dashboard/cases/first_6_most_recent_cases`,
    tallyCasesByStatus: `${baseUrl}/dashboard/cases/tally/status`,
  },
};
