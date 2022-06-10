FROM rust as builder

WORKDIR /usr/src/rscrape
COPY . .
RUN cargo install --path .

FROM debian:buster-slim
#RUN apt-get update && apt-get install -y <xyz> && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/rscrape /usr/local/bin/rscrape
CMD ["rscrape"]
