FROM nginx
COPY /build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
RUN touch /var/log/nginx/error.log /var/log/nginx/access.log
CMD ["nginx", "-g", "daemon off;"]
