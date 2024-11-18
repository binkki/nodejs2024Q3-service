FROM postgres:16.2-alpine
ENV POSTGRES_PASSWORD ${POSTGRES_PASSWORD}
ENV POSTGRES_DB ${POSTGRES_DB}
ENV POSTGRES_USER ${POSTGRES_USER}
ENV POSTGRES_HOST ${POSTGRES_HOST}
ENV POSTGRES_PORT ${POSTGRES_PORT}
EXPOSE 5432