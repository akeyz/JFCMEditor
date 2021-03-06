/**
 * Created by tengteng on 17/12/27.
 */

import axios from '../services/axios';

/**
 * 统一处理所有接口请求
 * 参数对象将会替换axios中默认参数中的键值对，其中可包含：
 * method
 * timeout
 * data
 * headers
 * dataType
 */
const server = {
  getTopics() {
    return axios('api/v1/topics', {
      method: 'get'
    });
  },
  getTopicDetail() {
    return axios('api/v1/topic/5433d5e4e737cbe96dcef312', {
      method: 'get'
    });
  },
  getSvgJSON() {
    return axios('http://localhost:8889/src/views/test.json', {
      method: 'get'
    });
  },
  getTest() {
    return axios('http://localhost:8890/src/views/test.json', {
      method: 'get'
    });
  },
  dataJSON() {
    return axios('http://localhost:8889/static/data.json', {
      method: 'get'
    });
  },
  userJSON() {
    return axios('http://localhost:8889/static/user.json', {
      method: 'get'
    });
  },
  upsJSON() {
    return axios('http://localhost:8889/static/upsUser.json', {
      method: 'get'
    });
  },
  preJSON() {
    return axios('http://localhost:8889/static/preUser.json', {
      method: 'get'
    });
  },
  getAreas() {
    return axios('http://192.168.1.3:8010/areas', {
      method: 'get'
    });
  },
  getTodata() {
    return axios('http://192.168.1.3:8010/areas', {
      method: 'get'
    });
  },
  getMockAreas() { // 通过模拟接口获得李迪凡部分区域数据
    return axios('https://easy-mock.com/mock/5af2b738c949372c3a474195/JF/areas', {
      method: 'get'
    });
  }
};

export default server;
