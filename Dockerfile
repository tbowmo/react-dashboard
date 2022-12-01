FROM node:16-alpine as node
RUN apk add tzdata gettext bash tini jq --no-cache && ln -sf /usr/share/zoneinfo/Europe/Copenhagen /etc/localtime
ENV TZ=Europe/Copenhagen

FROM node as sources
WORKDIR /usr/src/app
COPY . .
RUN tar -cf payload.tar lerna.json package.json yarn.lock packages/*/package.json
RUN md5sum payload.tar

FROM node as development
WORKDIR /usr/src/app
COPY --from=sources /usr/src/app/payload.tar ./
RUN \
    set -ex; \
    tar xf payload.tar; \
    yarn install --pure-lockfile --ignore-scripts; \
    date
COPY --from=sources /usr/src/app /usr/src/app

FROM development as production
# Install all, including dev dependencies - then re-install for production
ARG COMMIT=UNKNOWN
ARG VARIANT=local

ENV BUILD_COMMIT=${COMMIT} BUILD_VARIANT=${VARIANT} NODE_ENV=production
RUN set -ex; \
    yarn workspace @dashboard/backend build; \
    yarn workspace @dashboard/frontend build; \
    yarn install --production --ignore-scripts; \
    rm -rf packages/frontend/node_modules; \
    yarn cache clean


FROM node as runtime
EXPOSE 5000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "./packages/backend/lib/server.js"]
WORKDIR /usr/src/app
COPY --from=production /usr/src/app /usr/src/app

ARG COMMIT=UNKNOWN
ARG VARIANT=local

ENV BUILD_COMMIT=${COMMIT} BUILD_VARIANT=${VARIANT} NODE_ENV=production APP_HOST=0.0.0.0

RUN echo Commit: $BUILD_COMMIT
RUN echo Variant: $BUILD_VARIANT
