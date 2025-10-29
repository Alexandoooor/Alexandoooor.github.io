---
layout: post
title:  "Implenting a Limit Order Book in golang"
author: Alexander
tags: golang
---

## What is a Limit Order Book?

From the Wikipedia article on [Order Books](https://en.wikipedia.org/wiki/Order_book).
>An order book is the list of orders (manual or electronic) that a trading venue (in particular stock exchanges) uses to record the interest of buyers and sellers in a particular financial instrument. A matching engine uses the book to determine which orders can be fully or partially executed.

A *Limit* Order Book is an order book that is comprised of [Limit orders](https://en.wikipedia.org/wiki/Order_(exchange)#Limit_order).
>A limit order is an order to buy a security at no more than a specific price, or to sell a security at no less than a specific price (called "or better" for either direction). This gives the trader (customer) control over the price at which the trade is executed; however, the order may never be executed ("filled"). Limit orders are used when the trader wishes to control price rather than certainty of execution.

Another important concept is [Price Levels](https://en.wikipedia.org/wiki/Order_book)
>When several orders contain the same price, they are referred to as being on a price level. Practically, this means that if a bid comes at that price level, all the sell orders on that price level could potentially fulfill that.

![Example of a real Order Book](/assets/img/ExampleRealBook.png)
*Example of a real order book*

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
	ID          uuid.UUID
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
