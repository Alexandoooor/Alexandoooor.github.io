---
layout: post
title:  "Implementing a Limit Order Book in golang"
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

* * *
### How can we model a Limit Order Book in Go?
#### Order Book
My implementation models the order book as the type `OrderBook` which stores maps of the price levels for each
side (bid/ask) and a map with all of the current orders. It was also helpful to keep references to the lowest ask and the highest bid.

In addition I also stored a slice of all executed trades. This is technically a separate component and not a part of an order book, but it is convenient to validate that the order matching works as expected.

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

The levels are split up into the respective sides.

```golang
type Side int

const (
	Buy Side = iota
	Sell
)
```
* * *
#### Price Levels
Price levels are modeled as a linked list. Where each Level keeps a reference `nextLevel`.
`nextLevel` is needed because sometimes you need to traverse multiple levels in order to fully execute an order.
`nextLevel` is also used when adding a new level or removing a level when it becomes empty.

A level also contains `Volume` and `Count`. The volume is the total amount of shares contained in each order and the count is the number of orders in the level.

Furthermore, the orders in modeled as a doubly-linked list, `headOrder` and `tailOrder` are references to the first and last orders in the list, ordered by when the orders were placed.
This is to determine which order is to be matched against if there are multiple candiates that satisfy the conditions for execution of an incoming order.

```golang
type Level struct {
	Price     int
	Volume    int
	Count     int
	nextLevel *Level
	headOrder *Order
	tailOrder *Order
}
```

#### Example: Traversing multiple levels
Imagine that this is the ask side of an order book.

| amount       | price |
|:-------------|:------|
| 10           | 5     |
| 12           | 6     |
| 15           | 7     |

You place a buy order for 30 units at price 7.
The matching engine will check and see that the `lowestAsk` points to the level with `Level.Price == 5`.
But the `Level.Volume == 10`, this means that the matching engine can only execute 10 units at price 5.

The matching engine will then need to traverse the list to the next level, the level with `Level.Price == 6`, where it can match another
12 shares at price 6. The engine will continue to traverse the levels, until either the order is completely filled, or when there are no more asks within the price limit.

* * *
#### Orders
Orders are modeled by the `Order` type.
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
The members are quite straight forward. As previously mentioned orders are structured as a doubly-linked list.
- The reference to the `parentLevel` is needed to update the level `Count` and `Volume` when an order is added or removed.
- The member `Remaining` is needed since orders can be partially filled.

* * *
#### Trades

The `Trade` type is self explanatory.
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

* * *
### Summary
This was an interesting project and a fun way to practice writing Go.
A limit order book as a concept is quite simple. Implenting it was a bit more complicated though.
There are a lot of edge cases like partially filled orders, traversing multiple levels that needs to be handled.
Furthermore, many of the components are highly interconnected and it is important that updates to one component is correctly propagated to the others, in the right order.

The source of my Limit Order Book implementation is available in this [github repo](https://github.com/Alexandoooor/limit-order-book).

* * *
### Bonus content
#### Web-UI
I added a simple Web-UI to interact with the Order Book.

It allows a user to add buy or sell orders with a given price and size. It shows a visual representation of the order book, as well as a list of executed trades.

***full disclosure:** it is mostly vibe-coded using LLMs*

![Limit Order Book](/assets/img/LimitOrderBook.png)
*Limit Order Book Web-UI*

#### Persitency
I have also dabbled with persiting the state of the order book.
I have tried both dumping it to JSON and also writing and reading the state to a PostgreSQL database.

But I have not figured out completely when to read/write the state of the order book to the DB in order to keep the state correct.
In the JSON-case I could just keep one JSON-file with the whole state (`OrderBook`, `Level`, `Order` and `Trade` objects) serialized.
At each change, adding a new order for example, I would just dump the state of all objects to the file, ensuring that the JSON-file always reflected the in-memory state.

This is not a pretty solution, and it did obviously not work for the database, as it would be insane to overwrite the whole database at each update.
One of the challenges of using the database is to correctly save and restore the objects that are structured as linked lists, ensuring correct ordering.
