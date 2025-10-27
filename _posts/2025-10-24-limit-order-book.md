---
layout: post
title:  "Implenting a Limit Order Book in golang"
author: Alexander
tags: golang
---

## What is a Limit Order Book?

### How can we model a Limit Order Book in code?

```golang
type OrderBook struct {
	levels     map[Side]map[int]*Level
	orders     map[uuid.UUID]*Order
	lowestAsk  *Level
	highestBid *Level
	trades     []Trade
	storage    Storage
}
```

```golang
type OrderBook struct {
	levels     map[Side]map[int]*Level
	orders     map[uuid.UUID]*Order
	lowestAsk  *Level
	highestBid *Level
	trades     []Trade
	storage    Storage
}
```

```golang
type Order struct {
	Id          uuid.UUID
	Side        Side
	Size        int
	Remaining   int
	Price       int
	Time        time.Time
	nextOrder   *Order
	prevOrder   *Order
	parentLevel *Level
}
```

```golang
type Trade struct {
	ID       uuid.UUID
	Price    int
	Size     int
	Time     time.Time
	BuyOrderID  uuid.UUID
	SellOrderID uuid.UUID
}
```

```golang
// golang code with syntax highlighting.
func main() {
	flag.Parse()
	addr := ":" + strconv.Itoa(*port)

	logger := util.SetupLogging()
	engine.Logger = logger
	server.Logger = logger


	db := engine.InitPostgres()
	defer db.Close(context.Background())

	storage := engine.PostgresStorage{Database: db}
	ob := engine.NewOrderBook()
	ob.AddStorage(&storage)
	ob.RestoreOrderBook()

	logger.Printf("LimitOrderBook running on http://%s\n", addr)
	server := server.NewServer(addr, ob)
	if err := server.Serve(); err != nil {
		logger.Fatal(err)
	}
}
```

### There's a horizontal rule below this.

* * *

### A simple Web-UI

![Limit Order Book](/assets/img/LimitOrderBook.png)


```
docker stop local-postgres
docker rm local-postgres
docker run --name local-postgres -e POSTGRES_PASSWORD=SecurePassword -e POSTGRES_DB=local -p 5432:5432 -d postgres:latest
```

```
export POSTGRES_DB="local"
export POSTGRES_USER="postgres"
export POSTGRES_PASSWORD="SecurePassword"
export POSTGRES_HOST="localhost"
export POSTGRES_PORT="5432"
```
