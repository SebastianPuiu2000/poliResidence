package managers

import (
	"context"
	"log"
	"server/database"

	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
	ID       string `bson:"id"`
	Password string `bson:"password"`
}

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

func GetUsersCount() (int64, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	count, err := database.UsersCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		return 0, err
	}

	return count, nil
}

func FindOneUser(id string) (User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	opts := options.FindOne().SetProjection(bson.M{
		"_id":      0, // omit _id
		"id":       1,
		"password": 1,
	})

	var user User
	err := database.UsersCollection.
		FindOne(ctx, bson.M{"id": id}, opts).
		Decode(&user)

	return user, err
}
