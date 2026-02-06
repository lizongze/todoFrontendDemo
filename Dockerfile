FROM nginx
# 修改docker时区为东八区，规避应用程序和北京时间相差8小时问题
ENV TZ=Asia/Shanghai

# 不依赖流水线（有的项目在流水线中npm i老是报错，找不到好使的nodejs版本，就用这种方式了）
# （好多项目npm i会报错，本地用的pnpm i来装的，流水线又用不了pnpm）
ADD ./dist /usr/share/nginx/html/todo-app/

# 用压缩包的方式中转：将 dist.tar.gz 复制到 /html/todo-app
# tar -zcvf dist.tar.gz ./dist  # 需要在流水线中执行
# ADD dist.tar.gz /usr/share/nginx/html
# RUN mv /usr/share/nginx/html/dist /usr/share/nginx/html/todo-app

# log 一下，确认目录正确与否
RUN ls -R /usr/share/nginx/html/todo-app/

# 依赖流水线中将对应环境的 “ nginx 配置” 复制到 ./nginx.conf, 
# 然后再由 docker 复制到 /etc/nginx/conf.d 目录下
COPY ./default.conf  /etc/nginx/conf.d/

# 因为 Docker 容器需要有一个持续运行的前台进程。
# 通过 daemon off; 让 Nginx 在前台运行，容器就会保持运行状态。
# CMD ["nginx", "-g", "daemon off;"]
