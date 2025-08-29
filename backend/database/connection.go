package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var UsersCollection *mongo.Collection
var TaxesCollection *mongo.Collection

func ConnectMongo() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://root:example@localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	// (Optional) Ping to ensure connection works
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatal(err)
	}

	UsersCollection = client.Database("residence").Collection("users")
	TaxesCollection = client.Database("residence").Collection("taxes")

}
