FROM binfalse/jekyll AS compiler
ADD . .
RUN /usr/local/bin/jekyll build -d /site

FROM nginx
COPY --from=compiler /site /usr/share/nginx/html

