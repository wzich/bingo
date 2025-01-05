FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app/

RUN deno install

RUN deno task build

CMD ["deno", "task", "serve"]