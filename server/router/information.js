const Router = require('koa-router')
const Urls = require('../options/urls')
const service = require('../utils/axios')
const Consts = require('../options/consts')

const MockData = require('../options/mockData')

const router = new Router({
  prefix: `${Consts.BASE_API}/information`
})

const sign = Urls.sign;

/**
 * 获取玩家列表
 */
router.get('/playerList', async (ctx) => {
  // const { status, data } = await service.get(`${Urls.requestUrl}/playerList`, {
  //   params: {
  //     sign
  //   }
  // });
  // const ok = status === 200;

  const ok = false;
  ctx.status = 200;
  ctx.body = {
    total: ok ? total : MockData.playerList.total,
    items: ok ? items : MockData.playerList.items
  };
});

module.exports = router.routes();

