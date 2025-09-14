package configs

import (
	"log"
	"os"
)

var DbConnectionString string

func LoadDbConnectionString() {
	valueFromEnv := os.Getenv("MONGO")
	if valueFromEnv == "" {
		log.Println("JWT_SECRET is not set")
		// TODO: add this to docker-compose, remove it from here and add change Println to Fatal
		valueFromEnv = "mongodb://myuser:mypassword@localhost:27017/residence?authSource=admin"
	}

	DbConnectionString = valueFromEnv
}
