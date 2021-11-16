FROM rust as build

COPY ./src ./src

RUN cargo build --release

FROM debian:buster-slim

COPY --from=build /holodeck/target/release/app .

CMD ["./app"]