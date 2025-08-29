package managers

import (
	"context"
	"log"
	"server/database"

	"time"
)

func InsertManyUsers(objects []interface{}) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	res, err := database.UsersCollection.InsertMany(ctx, objects)
	if err != nil {
		return err // return error instead of exiting
	}

	log.Printf("Inserted IDs: %v", res.InsertedIDs)
	return nil
}
