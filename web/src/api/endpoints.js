export const endpoints = {
  upload: "/reports/upload/",
  history: "/reports/history/",
  star: (id) => `/reports/${id}/star/`,
  unstar: (id) => `/reports/${id}/unstar/`,
  compareSaved: (a, b) => `/reports/compare/${a}/${b}/`,
  compareTemp: "/reports/compare-temp/",
  pdf: (id) => `/reports/${id}/pdf/`,
  summaryCsv: (id) => `/reports/${id}/summary.csv/`,
  signup: "/auth/signup/",
  login: "/auth/login/",
};
