package managers

import (
	"context"
	"log"
	"server/database"

	"time"

	"go.mongodb.org/mongo-driver/bson"
)

func UpdateOneTax(id string, update bson.M) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := database.TaxesCollection.UpdateOne(ctx, bson.M{
		"id": id,
	}, update)
	if err != nil {
		return err // return error instead of exiting
	}

	return nil
}

func InsertManyTaxes(objects []interface{}) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	res, err := database.TaxesCollection.InsertMany(ctx, objects)
	if err != nil {
		return err // return error instead of exiting
	}

	log.Printf("Inserted IDs: %v", res.InsertedIDs)
	return nil
}

func GetTaxesCount() (int64, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	count, err := database.TaxesCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		return 0, err
	}

	return count, nil
}
