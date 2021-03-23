# Fundraise Up Test

## How to run this application

```sh
git clone git@github.com:chleck/fundraiseup.git
cd fundraiseup
docker-compose up
```

Then open http://localhost:8080

You can connect to DB with:

```sh
docker-compose exec mongo mongo mongodb://fru:devsecret@localhost:27017/fru?authSource=admin
```

and list saved donations with `db.donations.find().pretty()`
