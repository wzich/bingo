FROM denoland/deno

EXPOSE 5173

WORKDIR /app

ADD client/ /app/

ADD types.ts /app/

RUN deno install

RUN deno build

CMD ["deno", "serve"]