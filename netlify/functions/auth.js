export default async function handler(request) {
  // 从Netlify后台环境变量读取账号密码
  const USER = Netlify.env.get("AUTH_USER");
  const PWD = Netlify.env.get("AUTH_PASS");
  const authHeader = request.headers.get("authorization");

  // 未携带认证头，返回401弹窗
  if (!authHeader) {
    return new Response("需要访问密码", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="站点访问"' }
    });
  }

  // 解析账号密码
  const base64 = authHeader.split(" ")[1];
  const [user, pass] = atob(base64).split(":");

  // 校验匹配放行，否则拒绝
  if (user === USER && pass === PWD) {
    return;
  } else {
    return new Response("账号密码错误", { status: 401 });
  }
}

// 匹配全站所有页面
export const config = { path: "/*" };
