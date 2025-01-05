FROM denoland/deno

EXPOSE 5173

WORKDIR /app

ADD . /app/

RUN deno install

RUN deno task build

CMD ["deno", "serve"]