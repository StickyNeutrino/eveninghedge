FROM rust as build

RUN cargo new cache 

COPY ./Cargo.toml ./cache/Cargo.toml

WORKDIR /cache

RUN cargo build --release

COPY ./src ./src 

RUN rm ./target/release/deps/scraper*

RUN cargo build --release

FROM debian:buster-slim

COPY --from=build /cache/target/release/scraper ./app

RUN apt update && apt install libssl1.1 ca-certificates -y

CMD ["./app"]