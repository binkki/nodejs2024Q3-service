FROM postgres:16.2-alpine
RUN mkdir -p /var/log/postgresql
RUN chown postgres:postgres /var/log/postgresql
EXPOSE 5432