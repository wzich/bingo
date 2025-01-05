FROM denoland/deno

EXPOSE 5173

WORKDIR /app

ADD . /app/

RUN deno install

RUN deno build

CMD ["deno", "serve"]