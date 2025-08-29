package services

import (
	"server/managers"
	"strconv"

	"go.mongodb.org/mongo-driver/bson"
)

func PopulateTaxes() error {

	count, err := managers.GetTaxesCount()
	if err != nil || count > 0 {
		return nil
	}

	var objects []interface{}
	for i := 1; i <= 98; i++ {
		objects = append(objects, bson.M{
			"id":          strconv.Itoa(i),
			"information": bson.M{}, // default placeholder
		})
	}

	err = managers.InsertManyTaxes(objects)
	if err != nil {
		return err
	}

	return nil
}
