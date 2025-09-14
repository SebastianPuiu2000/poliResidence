package configs

import (
	"log"
	"os"
)

var JwtSecret []byte

func LoadJwt() {
	valueFromEnv := os.Getenv("JWT")
	if valueFromEnv == "" {
		log.Println("JWT is not set")
		// TODO: add this to docker-compose, remove it from here and add change Println to Fatal
		valueFromEnv = "5N8k2XqD9bRt4LmY7pZf0Vc3sHjU1aWqE6yTnO2gLxR9mKdP"
	}

	JwtSecret = []byte(valueFromEnv)
}
