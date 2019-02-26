export default async ({ redirect, store, error }) => {
  // If nuxt generate, pass this middleware
  if (process.static) return;
  if (!store.getters.name) {
    // 可通过组件的props接收error信息
    // error({
    //   message: 'cookie失效或未登录，请登录后操作',
    //   statusCode: 403
    // });
    return redirect('/login');
  }
}
