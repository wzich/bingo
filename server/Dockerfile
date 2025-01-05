FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app/

RUN deno install --entrypoint server.ts

CMD ["run", "--allow-net", "server.ts"]